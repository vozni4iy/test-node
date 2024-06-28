import { Router, Request, Response } from 'express';
import Book, { IBook } from '../models/Book.js';
import { SortOrder } from 'mongoose';
import User, { IUser } from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

const validSortFields = ['name', 'pages', 'price'];

// Get all books with pagination, sorting, and search
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    let sortField = (req.query.sort as string) || 'name';
    const sortOrder = (req.query.order as string) || 'asc';
    const searchKey = (req.query.searchKey as string) || '';

    if (!validSortFields.includes(sortField)) {
      sortField = 'name';
    }

    const sort: { [key: string]: SortOrder } = {
      [sortField]: sortOrder === 'asc' ? 1 : -1,
    };

    const searchCondition = searchKey
      ? {
          $or: [{ name: { $regex: searchKey, $options: 'i' } }],
        }
      : {};

    const books = await Book.find(searchCondition)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .populate('author');
    const totalCount = await Book.countDocuments(searchCondition);

    res.json({
      totalCount,
      limit,
      offset,
      sort: sortField,
      order: sortOrder,
      searchKey,
      books,
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get book by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a new book
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, pages, price, author } = req.body;
    const newBook = new Book({
      name,
      pages,
      price,
      author,
    });
    console.log('try to create a new book: ', newBook);
    await newBook.save();
    console.log('new book is saved');

    // Update the author's books field
    const user = await User.findById(author);
    if (user) {
      user.books.push(name);
      await user.save();
    }

    res.status(201).json(newBook);
  } catch (err) {
    console.log('error: ', err);
    res.status(500).send('Server error');
  }
});

// Update a book by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, pages, price, author } = req.body;
    const book = (await Book.findById(req.params.id)) as IBook;
    if (!book) return res.status(404).send('Book not found');

    // Check if the author has changed
    if (book.author.toString() !== author) {
      // Remove the book name from the previous author's books field
      const previousAuthor = await User.findById(book.author);
      if (previousAuthor) {
        previousAuthor.books = previousAuthor.books.filter(
          (bookId) => bookId !== book.fileId
        );
        await previousAuthor.save();
      }

      // Add the book name to the new author's books field
      const newAuthor = await User.findById(author);
      if (newAuthor) {
        newAuthor.books.push(book.fileId);
        await newAuthor.save();
      }
    }

    // Update the book
    book.name = name;
    book.pages = pages;
    book.price = price;
    book.author = author;
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a book by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');

    // Remove the book name from the author's books field
    const author = (await User.findById(book.author)) as IUser;
    if (author) {
      author.books = author.books.filter((bookId) => bookId !== book.fileId);
      await author.save();
    }

    res.send('Book deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
