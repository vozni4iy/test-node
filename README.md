# My Node Project

A test project for learning Node.js, Express, and TypeScript. This project includes basic authentication, routing, middlewares, and MongoDB GridFS usage.

## Features

- **Node.js & Express**: Core framework for the application.
- **TypeScript**: For static typing and improved development experience.
- **MongoDB & Mongoose**: Database integration and schema management.
- **JWT**: JSON Web Token for authentication.
- **GridFS**: For file storage within MongoDB.
- **ESLint & Prettier**: For code linting and formatting.
- **Nodemon**: For auto-restarting the server during development.
- **Browser-Sync**: For live reloading during development.

## Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:vozni4iy/test-node.git
   cd test-node
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   ```plaintext
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/mydatabase
   JWT_SECRET=your_jwt_secret
   ```

## Usage

### Development
To start the development server with auto-reloading:
```bash
npm run concurrently
```

### Production
To build and start the production server:
```bash
npm run build
npm run start:prod
```

### Other Scripts
- **Lint the code:**
  ```bash
  npm run lint
  ```
- **Format the code:**
  ```bash
  npm run format
  ```

## Author

Ihor Skakun

## License

This project is licensed under the ISC License.
