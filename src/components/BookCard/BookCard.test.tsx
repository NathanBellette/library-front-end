import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from './BookCard';
import { Book } from '../../types';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  owner: 'Test Owner',
  availability: 'available',
  isbn: '1234567890',
  description: 'A test book description',
  publishedYear: 2023,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockHandlers = {
  onBorrow: jest.fn(),
  onReturn: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('BookCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book information correctly', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('Owner: Test Owner')).toBeInTheDocument();
    expect(screen.getByText('ISBN: 1234567890')).toBeInTheDocument();
    expect(screen.getByText('Published: 2023')).toBeInTheDocument();
    expect(screen.getByText('A test book description')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('shows borrow button when book is available', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    expect(screen.getByText('Borrow')).toBeInTheDocument();
    expect(screen.queryByText('Return')).not.toBeInTheDocument();
  });

  it('shows return button when book is borrowed', () => {
    const borrowedBook = { ...mockBook, availability: 'borrowed' as const };
    render(<BookCard book={borrowedBook} {...mockHandlers} />);
    
    expect(screen.getByText('Return')).toBeInTheDocument();
    expect(screen.queryByText('Borrow')).not.toBeInTheDocument();
    expect(screen.getByText('Borrowed')).toBeInTheDocument();
  });

  it('calls onBorrow when borrow button is clicked', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    fireEvent.click(screen.getByText('Borrow'));
    expect(mockHandlers.onBorrow).toHaveBeenCalledWith('1');
  });

  it('calls onReturn when return button is clicked', () => {
    const borrowedBook = { ...mockBook, availability: 'borrowed' as const };
    render(<BookCard book={borrowedBook} {...mockHandlers} />);
    
    fireEvent.click(screen.getByText('Return'));
    expect(mockHandlers.onReturn).toHaveBeenCalledWith('1');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    fireEvent.click(screen.getByTitle('Edit book'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockBook);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    fireEvent.click(screen.getByTitle('Delete book'));
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this book?');
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('does not call onDelete when delete is not confirmed', () => {
    window.confirm = jest.fn(() => false);
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    fireEvent.click(screen.getByTitle('Delete book'));
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this book?');
    expect(mockHandlers.onDelete).not.toHaveBeenCalled();
  });

  it('handles missing optional fields gracefully', () => {
    const bookWithoutOptional = {
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
      owner: 'Test Owner',
      availability: 'available' as const,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    
    render(<BookCard book={bookWithoutOptional} {...mockHandlers} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.queryByText('ISBN:')).not.toBeInTheDocument();
    expect(screen.queryByText('Published:')).not.toBeInTheDocument();
  });
});
