import express from 'express';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import booksRouter from './routes/books.js';
import authRouter from './routes/auth.js';
import contentRouter from './routes/content.js';

import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import { fakeAuthHandler } from './routes/fake-auth.js';
import { handleForbiddenError } from './middleware/handleForbiddenError.js';
import { connectDB } from './db.js';

const app = express();
const port = 5001;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Use custom logging middleware
app.use(logger);

// Use the routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/auth', authRouter);
app.use('/content', contentRouter);

// Fake authentication route
app.get('/fake-auth', fakeAuthHandler);

// Use 404 middleware
app.use(notFound);

// Use 403 error handling middleware
app.use(handleForbiddenError);

// Use custom error handling middleware
app.use(errorHandler);

app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
