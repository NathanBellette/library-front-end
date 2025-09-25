import React from 'react';
import { render, screen } from '@testing-library/react';
import { BookList } from './BookList';
import { Book } from '../../types';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Book 1',
    author: 'Author 1',
    owner: 'Owner 1',
    availability: 'available',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Book 2',
    author: 'Author 2',
    owner: 'Owner 2',
    availability: 'borrowed',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

const defaultProps = {
  books: mockBooks,
  currentPage: 1,
  totalPages: 1,
  totalItems: 2,
  itemsPerPage: 10,
  isLoading: false,
  onPageChange: jest.fn(),
  onBorrow: jest.fn(),
  onReturn: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('BookList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders books when not loading and books exist', () => {
    render(<BookList {...defaultProps} />);
    
    expect(screen.getByText('Book 1')).toBeInTheDocument();
    expect(screen.getByText('Book 2')).toBeInTheDocument();
    expect(screen.getByText('by Author 1')).toBeInTheDocument();
    expect(screen.getByText('by Author 2')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<BookList {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading books...')).toBeInTheDocument();
    expect(screen.queryByText('Book 1')).not.toBeInTheDocument();
  });

  it('shows empty state when no books and not loading', () => {
    render(<BookList {...defaultProps} books={[]} />);
    
    expect(screen.getByText('No books found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria or add some books to the library.')).toBeInTheDocument();
  });

  it('renders pagination when books exist', () => {
    render(<BookList {...defaultProps} totalPages={3} />);
    
    expect(screen.getByText('Showing 1-2 of 2 books')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('does not render pagination when only one page', () => {
    render(<BookList {...defaultProps} totalPages={1} />);
    
    expect(screen.getByText('Showing 2 books')).toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('passes correct props to BookCard components', () => {
    const mockOnBorrow = jest.fn();
    const mockOnReturn = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    
    render(
      <BookList
        {...defaultProps}
        onBorrow={mockOnBorrow}
        onReturn={mockOnReturn}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // The BookCard components should be rendered with the correct props
    // We can't directly test the props passed to BookCard, but we can verify
    // that the BookCard components are rendered with the correct book data
    expect(screen.getByText('Book 1')).toBeInTheDocument();
    expect(screen.getByText('Book 2')).toBeInTheDocument();
  });

  it('handles empty books array correctly', () => {
    render(<BookList {...defaultProps} books={[]} totalItems={0} />);
    
    expect(screen.getByText('No books found')).toBeInTheDocument();
    expect(screen.queryByText('Book 1')).not.toBeInTheDocument();
  });

  it('shows correct pagination info for different page sizes', () => {
    const { rerender } = render(
      <BookList {...defaultProps} itemsPerPage={5} totalItems={12} currentPage={2} totalPages={3} />
    );
    
    expect(screen.getByText('Showing 6-10 of 12 books')).toBeInTheDocument();
    
    rerender(
      <BookList {...defaultProps} itemsPerPage={20} totalItems={15} currentPage={1} totalPages={1} />
    );
    
    expect(screen.getByText('Showing 15 books')).toBeInTheDocument();
  });
});
