# Library Frontend App

A modern React TypeScript application for managing a library system where users can lend and borrow books from each other.

## Features

- 📚 **Book Management**: Add, edit, delete, and search books
- 🔍 **Search & Filter**: Real-time search functionality
- 📄 **Pagination**: Navigate through large collections of books
- 🔄 **Availability Toggle**: Borrow/return books with visual status indicators
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, professional interface built with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Jest** & **React Testing Library** for testing
- **Custom Hooks** for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd library-front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddBookModal/   # Modal for adding/editing books
│   ├── BookCard/       # Individual book display component
│   ├── BookList/       # Table view of books
│   ├── Pagination/     # Pagination controls
│   └── SearchBar/      # Search input component
├── hooks/              # Custom React hooks
│   └── useBooks.ts     # Book management logic
├── services/           # API service layer
│   └── api.ts          # Backend API integration
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types and interfaces
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## API Integration

The app is designed to work with a backend API running on `http://localhost:5292/api`. The API should provide the following endpoints:

- `GET /books` - Get paginated list of books
- `POST /books` - Create a new book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book
- `PATCH /books/:id/toggle` - Toggle book availability

## Component Architecture

### BookList Component
Displays books in a clean table format with:
- Book title and author
- Owner information
- Availability status with toggle buttons
- Delete functionality

### SearchBar Component
Provides real-time search functionality with:
- Input field with clear button
- Search button
- Debounced search to optimize performance

### AddBookModal Component
Modal dialog for adding/editing books with:
- Form validation
- Error handling
- Responsive design

### Pagination Component
Simple pagination controls showing:
- Current page information
- Previous/Next navigation
- Page count display

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design principles
- Clean, modern interface
- Consistent color scheme
- Accessible components

## Testing

The project includes comprehensive tests using Jest and React Testing Library:
- Component unit tests
- User interaction tests
- Accessibility tests
- Mock API responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
