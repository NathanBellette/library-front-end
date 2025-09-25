export interface Book {
  id: string;
  title: string;
  author: string;
  owner: string;
  availability: 'available' | 'borrowed';
  isbn?: string;
  description?: string;
  publishedYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  owner: string;
  isbn?: string;
  description?: string;
  publishedYear?: number;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  owner?: string;
  isbn?: string;
  description?: string;
  publishedYear?: number;
}

export interface BookSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  owner?: string;
  availability?: 'available' | 'borrowed';
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
}
