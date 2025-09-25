import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
    totalItems: 50,
    itemsPerPage: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination info correctly', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('Showing 1-10 of 50 books')).toBeInTheDocument();
  });

  it('renders all page numbers when total pages is 5 or less', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows current page as active', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const page3Button = screen.getByText('3');
    expect(page3Button).toHaveClass('bg-blue-600', 'text-white');
  });

  it('calls onPageChange when page button is clicked', () => {
    render(<Pagination {...defaultProps} />);
    
    fireEvent.click(screen.getByText('2'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('enables previous and next buttons on middle pages', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');
    
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange with previous page when previous button is clicked', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    fireEvent.click(screen.getByText('Previous'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page when next button is clicked', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis for large page counts', () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={5} />);
    
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('shows only info when total pages is 1', () => {
    render(<Pagination {...defaultProps} totalPages={1} currentPage={1} totalItems={5} />);
    
    expect(screen.getByText('Showing 5 books')).toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('handles single book correctly', () => {
    render(<Pagination {...defaultProps} totalPages={1} currentPage={1} totalItems={1} />);
    
    expect(screen.getByText('Showing 1 book')).toBeInTheDocument();
  });

  it('calculates correct item range for different pages', () => {
    const { rerender } = render(
      <Pagination {...defaultProps} currentPage={2} itemsPerPage={10} totalItems={25} />
    );
    
    expect(screen.getByText('Showing 11-20 of 25 books')).toBeInTheDocument();
    
    rerender(
      <Pagination {...defaultProps} currentPage={3} itemsPerPage={10} totalItems={25} />
    );
    
    expect(screen.getByText('Showing 21-25 of 25 books')).toBeInTheDocument();
  });

  it('handles edge case where current page is greater than total pages', () => {
    render(<Pagination {...defaultProps} currentPage={10} totalPages={5} />);
    
    // Should still render without crashing
    expect(screen.getByText('Showing 50-50 of 50 books')).toBeInTheDocument();
  });
});
