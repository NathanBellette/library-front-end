import { useState } from 'react';
import { Book, CreateBookRequest, UpdateBookRequest } from './types';
import { useBooks } from './hooks/useBooks';
import { SearchBar } from './components/SearchBar';
import { BookList } from './components/BookList';
import { AddBookModal } from './components/AddBookModal';

function App() {
  const {
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
  } = useBooks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSaveBook = async (bookData: CreateBookRequest | UpdateBookRequest) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData as UpdateBookRequest);
      } else {
        await createBook(bookData as CreateBookRequest);
      }
    } catch (error) {
      // Error is handled in the hook and displayed via the error state
      console.error('Error saving book:', error);
    }
  };

  const handleBorrowBook = async (id: string) => {
    try {
      await borrowBook(id);
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturnBook = async (id: string) => {
    try {
      await returnBook(id);
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Library</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Search:
          </label>
          <SearchBar onSearch={searchBooks} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>Error: {error}</p>
            <button
              className="mt-2 text-sm underline hover:no-underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Book Table */}
        <BookList
          books={books}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          isLoading={isLoading}
          onPageChange={changePage}
          onBorrow={handleBorrowBook}
          onReturn={handleReturnBook}
          onDelete={handleDeleteBook}
        />
      </main>

      {/* Floating Add Book Button */}
      <button
        onClick={handleAddBook}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl z-40"
      >
        Add Book
      </button>

      <AddBookModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBook}
        editingBook={editingBook}
      />
    </div>
  );
}

export default App;
