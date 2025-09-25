import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { bookApi } from '../services/api';

// Mock the API
jest.mock('../services/api', () => ({
  bookApi: {
    searchBooks: jest.fn(),
    createBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
    borrowBook: jest.fn(),
    returnBook: jest.fn(),
  },
}));

const mockBookApi = bookApi as jest.Mocked<typeof bookApi>;

const mockBooks = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Author 1',
    owner: 'Owner 1',
    availability: 'available' as const,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Book 2',
    author: 'Author 2',
    owner: 'Owner 2',
    availability: 'borrowed' as const,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

const mockPaginatedResponse = {
  data: mockBooks,
  pagination: {
    page: 1,
    limit: 12,
    total: 2,
    totalPages: 1,
  },
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBookApi.searchBooks.mockResolvedValue(mockPaginatedResponse);
  });

  it('renders app title and subtitle', () => {
    render(<App />);
    
    expect(screen.getByText('📚 Library App')).toBeInTheDocument();
    expect(screen.getByText('Lend and borrow books with friends')).toBeInTheDocument();
  });

  it('renders search bar and add book button', () => {
    render(<App />);
    
    expect(screen.getByPlaceholderText('Search books by title, author, or ISBN...')).toBeInTheDocument();
    expect(screen.getByText('+ Add Book')).toBeInTheDocument();
  });

  it('opens add book modal when add book button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.click(screen.getByText('+ Add Book'));
    
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.click(screen.getByText('+ Add Book'));
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    
    await user.click(screen.getByTitle('Close'));
    
    await waitFor(() => {
      expect(screen.queryByText('Add New Book')).not.toBeInTheDocument();
    });
  });

  it('creates a new book when form is submitted', async () => {
    const user = userEvent.setup();
    mockBookApi.createBook.mockResolvedValue(mockBooks[0]);
    
    render(<App />);
    
    await user.click(screen.getByText('+ Add Book'));
    
    await user.type(screen.getByLabelText('Title *'), 'New Book');
    await user.type(screen.getByLabelText('Author *'), 'New Author');
    await user.type(screen.getByLabelText('Owner *'), 'New Owner');
    
    await user.click(screen.getByText('Add Book'));
    
    await waitFor(() => {
      expect(mockBookApi.createBook).toHaveBeenCalledWith({
        title: 'New Book',
        author: 'New Author',
        owner: 'New Owner',
        isbn: '',
        description: '',
        publishedYear: undefined,
      });
    });
  });

  it('searches books when search is performed', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Search books by title, author, or ISBN...');
    await user.type(searchInput, 'test query');
    await user.click(screen.getByText('Search'));
    
    expect(mockBookApi.searchBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'test query',
        page: 1,
        limit: 12,
      })
    );
  });

  it('handles API errors gracefully', async () => {
    mockBookApi.searchBooks.mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  it('shows retry button when there is an error', async () => {
    mockBookApi.searchBooks.mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('displays books when they are loaded', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    mockBookApi.searchBooks.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<App />);
    
    expect(screen.getByText('Loading books...')).toBeInTheDocument();
  });

  it('handles empty book list', async () => {
    mockBookApi.searchBooks.mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('No books found')).toBeInTheDocument();
    });
  });
});
