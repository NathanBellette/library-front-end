import React, { useState, useEffect } from 'react';
import { CreateBookRequest, Book } from '../../types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: CreateBookRequest) => Promise<void>;
  editingBook?: Book | null;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBook,
}) => {
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
    owner: '',
    isbn: '',
    description: '',
    publishedYear: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        owner: editingBook.owner,
        isbn: editingBook.isbn || '',
        description: editingBook.description || '',
        publishedYear: editingBook.publishedYear,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        owner: '',
        isbn: '',
        description: '',
        publishedYear: undefined,
      });
    }
    setErrors({});
  }, [editingBook, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }

    if (formData.publishedYear && (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear())) {
      newErrors.publishedYear = 'Published year must be between 1000 and current year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' ? (value ? parseInt(value, 10) : undefined) : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button 
            className="modal__close" 
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
        
        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              placeholder="Enter book title"
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author" className="form-label">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`form-input ${errors.author ? 'form-input--error' : ''}`}
              placeholder="Enter author name"
            />
            {errors.author && <span className="form-error">{errors.author}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="owner" className="form-label">
              Owner *
            </label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className={`form-input ${errors.owner ? 'form-input--error' : ''}`}
              placeholder="Enter owner name"
            />
            {errors.owner && <span className="form-error">{errors.owner}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="isbn" className="form-label">
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter ISBN (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="publishedYear" className="form-label">
              Published Year
            </label>
            <input
              type="number"
              id="publishedYear"
              name="publishedYear"
              value={formData.publishedYear || ''}
              onChange={handleChange}
              className={`form-input ${errors.publishedYear ? 'form-input--error' : ''}`}
              placeholder="Enter published year (optional)"
              min="1000"
              max={new Date().getFullYear()}
            />
            {errors.publishedYear && <span className="form-error">{errors.publishedYear}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input form-input--textarea"
              placeholder="Enter book description (optional)"
              rows={3}
            />
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (editingBook ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
