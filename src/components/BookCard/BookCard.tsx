import React from 'react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onBorrow,
  onReturn,
  onEdit,
  onDelete,
}) => {
  const handleBorrow = () => {
    onBorrow(book.id);
  };

  const handleReturn = () => {
    onReturn(book.id);
  };

  const handleEdit = () => {
    onEdit(book);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDelete(book.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-start p-6 pb-4 gap-4">
        <h3 className="text-xl font-semibold text-gray-900 leading-tight flex-1">
          {book.title}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="p-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center text-lg"
            onClick={handleEdit}
            title="Edit book"
          >
            ✏️
          </button>
          <button
            className="p-2 rounded-md hover:bg-red-50 transition-colors duration-200 flex items-center justify-center text-lg"
            onClick={handleDelete}
            title="Delete book"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="px-6 pb-4">
        <p className="font-medium text-gray-600 mb-2">by {book.author}</p>
        <p className="text-gray-500 text-sm mb-2">Owner: {book.owner}</p>
        
        {book.isbn && (
          <p className="text-gray-500 text-sm mb-1">ISBN: {book.isbn}</p>
        )}
        
        {book.publishedYear && (
          <p className="text-gray-500 text-sm mb-1">Published: {book.publishedYear}</p>
        )}
        
        {book.description && (
          <p className="text-gray-600 text-sm leading-relaxed mt-3 line-clamp-3">
            {book.description}
          </p>
        )}
      </div>
      
      <div className="px-6 pb-6 flex justify-between items-center gap-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
          book.availability === 'available' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {book.availability === 'available' ? 'Available' : 'Borrowed'}
        </div>
        
        <div className="flex-shrink-0">
          {book.availability === 'available' ? (
            <button
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
              onClick={handleBorrow}
            >
              Borrow
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
              onClick={handleReturn}
            >
              Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
