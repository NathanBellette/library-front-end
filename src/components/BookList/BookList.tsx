import React from 'react';
import { Book } from '../../types';
import { Pagination } from '../Pagination';

interface BookListProps {
  books: Book[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading,
  onPageChange,
  onBorrow,
  onReturn,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-gray-500">Loading books...</div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add some books to the library.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.owner}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => book.availability === 'available' ? onBorrow(book.id) : onReturn(book.id)}
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        book.availability === 'available'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {book.availability === 'available' ? '✓ Available' : '✗ Borrowed'}
                    </button>
                    <button
                      onClick={() => onDelete(book.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="Delete book"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};
