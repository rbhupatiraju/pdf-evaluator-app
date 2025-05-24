# PDF Viewer Application

A modern web application for viewing and managing PDF documents with features like document filtering, checks management, and document upload capabilities.

## Features

- PDF document viewing and management
- Document filtering by client, status, and date range
- Checks management system
- Document upload with type categorization
- Modern Material-UI based interface
- Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new-pdf-viewer
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the application in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Runs ESLint to check for code issues
- `npm run format` - Formats code using Prettier

## Project Structure

```
src/
├── components/         # React components
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── vite-env.d.ts      # TypeScript declarations
```

## Technologies Used

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [React PDF](https://react-pdf.org/)

## Code Style

This project uses Prettier for code formatting. The configuration can be found in `.prettierrc`.

To format your code:
```bash
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 