import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search books by title, author, or ISBN...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom search placeholder';
    render(<SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search books by title, author, or ISBN...');
    const submitButton = screen.getByText('Search');
    
    await user.type(input, 'test query');
    await user.click(submitButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('calls onSearch when enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search books by title, author, or ISBN...');
    
    await user.type(input, 'test query');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('calls onSearch with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search books by title, author, or ISBN...');
    const clearButton = screen.getByTitle('Clear search');
    
    await user.type(input, 'test query');
    await user.click(clearButton);
    
    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search books by title, author, or ISBN...');
    
    await user.type(input, 'test query');
    
    expect(input).toHaveValue('test query');
  });

  it('calls onSearch with current input value on submit', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search books by title, author, or ISBN...');
    const submitButton = screen.getByText('Search');
    
    await user.type(input, 'search term');
    await user.click(submitButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('search term');
  });
});
