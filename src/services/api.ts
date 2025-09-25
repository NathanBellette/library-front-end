import { Book, CreateBookRequest, UpdateBookRequest, BookSearchParams, PaginatedResponse } from '../types';

const API_BASE_URL = 'http://localhost:5292/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, errorData.message || 'An error occurred');
  }
  return response.json();
}

export const bookApi = {
  // Search books with pagination
  async searchBooks(params: BookSearchParams = {}): Promise<PaginatedResponse<Book>> {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.owner) searchParams.append('owner', params.owner);
    if (params.availability) searchParams.append('availability', params.availability);

    const response = await fetch(`${API_BASE_URL}/books?${searchParams.toString()}`);
    return handleResponse<PaginatedResponse<Book>>(response);
  },

  // Get a single book by ID
  async getBook(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    return handleResponse<Book>(response);
  },

  // Create a new book
  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return handleResponse<Book>(response);
  },

  // Update a book
  async updateBook(id: string, bookData: UpdateBookRequest): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return handleResponse<Book>(response);
  },

  // Delete a book
  async deleteBook(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new ApiError(response.status, errorData.message || 'An error occurred');
    }
  },

  // Borrow a book
  async borrowBook(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}/borrow`, {
      method: 'POST',
    });
    return handleResponse<Book>(response);
  },

  // Return a book
  async returnBook(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}/return`, {
      method: 'POST',
    });
    return handleResponse<Book>(response);
  },
};
