import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);


  if (totalPages <= 1) {
    return (
      <div className="text-center text-gray-500 text-sm">
        Showing {totalItems} {totalItems === 1 ? 'book' : 'books'}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div className="text-gray-500 text-sm">
        Showing {startItem}-{endItem} of {totalItems} books
      </div>
      
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        <span className="px-2 py-1 text-sm text-gray-700">
          {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
