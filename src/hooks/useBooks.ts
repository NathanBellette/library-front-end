import { useState, useEffect, useCallback } from 'react';
import { Book, BookSearchParams, CreateBookRequest, UpdateBookRequest, PaginatedResponse } from '../types';
import { bookApi } from '../services/api';

export const useBooks = (initialParams: BookSearchParams = {}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<BookSearchParams>(initialParams);

  const fetchBooks = useCallback(async (params: BookSearchParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Book> = await bookApi.searchBooks({
        ...searchParams,
        ...params,
        page: params.page || searchParams.page || 1,
        limit: params.limit || searchParams.limit || 12,
      });
      
      setBooks(response.items);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch books';
      setError(errorMessage);
      console.error('Error fetching books:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  const searchBooks = useCallback((query: string) => {
    const newParams = { ...searchParams, query, page: 1 };
    setSearchParams(newParams);
    fetchBooks(newParams);
  }, [searchParams, fetchBooks]);

  const changePage = useCallback((page: number) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
    fetchBooks(newParams);
  }, [searchParams, fetchBooks]);

  const createBook = useCallback(async (bookData: CreateBookRequest) => {
    try {
      await bookApi.createBook(bookData);
      // Refresh the current page
      fetchBooks(searchParams);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create book';
      setError(errorMessage);
      throw err;
    }
  }, [fetchBooks, searchParams]);

  const updateBook = useCallback(async (id: string, bookData: UpdateBookRequest) => {
    try {
      await bookApi.updateBook(id, bookData);
      // Refresh the current page
      fetchBooks(searchParams);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update book';
      setError(errorMessage);
      throw err;
    }
  }, [fetchBooks, searchParams]);

  const deleteBook = useCallback(async (id: string) => {
    try {
      await bookApi.deleteBook(id);
      // Refresh the current page
      fetchBooks(searchParams);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete book';
      setError(errorMessage);
      throw err;
    }
  }, [fetchBooks, searchParams]);

  const borrowBook = useCallback(async (id: string) => {
    try {
      await bookApi.borrowBook(id);
      // Refresh the current page
      fetchBooks(searchParams);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to borrow book';
      setError(errorMessage);
      throw err;
    }
  }, [fetchBooks, searchParams]);

  const returnBook = useCallback(async (id: string) => {
    try {
      await bookApi.returnBook(id);
      // Refresh the current page
      fetchBooks(searchParams);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to return book';
      setError(errorMessage);
      throw err;
    }
  }, [fetchBooks, searchParams]);

  // Initial load
  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    pagination,
    isLoading,
    error,
    searchBooks,
    changePage,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    refetch: () => fetchBooks(searchParams),
  };
};
