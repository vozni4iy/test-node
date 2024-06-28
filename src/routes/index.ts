import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.setHeader('X-Custom-Header', 'CustomHeaderValue');
  res.send('Hello World from the index route!');
});

router.get('/sync-error', (req, res, next) => {
  // Simulate a server error
  const error = new Error('Simulated server error');
  next(error); // Pass the error to the error handling middleware
});

router.get('/async-error', async (req, res, next) => {
  try {
    // Simulate an async error (e.g., database call fails)
    throw new Error('Simulated async error');
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

export default router;
