// routes/users.js
import { Router } from 'express';
import User from '../models/User.js';
import mongoose, { SortOrder } from 'mongoose';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

// Type guard to check if the error is a MongoError
function isMongoError(error: unknown): error is mongoose.mongo.MongoError {
  return error instanceof mongoose.mongo.MongoError;
}

const validSortFields = ['firstName', 'lastName'];

// Get all users
router.get('/', async (req, res) => {
  try {
    // Read limit and offset from query params, with default values
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const offset = parseInt(req.query.offset as string, 10) || 0;

    // Read sort and order from query params, with default values
    let sortField = (req.query.sort as string) || 'firstName';
    const sortOrder = (req.query.order as string) || 'asc';

    // Validate sortField and default to 'firstName' if invalid
    if (!validSortFields.includes(sortField)) {
      sortField = 'firstName';
    }

    // Create sort object for Mongoose
    const sort: { [key: string]: SortOrder } = {
      [sortField]: sortOrder === 'asc' ? 1 : -1,
    };

    // Read searchKey from query params
    const searchKey = (req.query.searchKey as string) || '';

    // Create search condition
    const searchCondition = searchKey
      ? {
          $or: [
            { firstName: { $regex: searchKey, $options: 'i' } },
            { lastName: { $regex: searchKey, $options: 'i' } },
            { email: { $regex: searchKey, $options: 'i' } },
          ],
          suspended: false,
        }
      : { suspended: false };

    // Fetch users with pagination
    const users = await User.find(searchCondition)
      .limit(limit)
      .skip(offset)
      .sort(sort);

    // Get the total count of users
    const totalCount = await User.countDocuments();

    // Send paginated response with total count
    res.json({
      totalCount,
      limit,
      offset,
      sort: sortField,
      order: sortOrder,
      searchKey,
      users,
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      // Duplicate key error code
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, password, suspended } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, password, suspended },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send('User deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.patch('/:id/suspend', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { suspended: true },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Restore a user by ID
router.patch('/:id/restore', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { suspended: false },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
