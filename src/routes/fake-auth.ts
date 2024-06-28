import { Request, Response, NextFunction } from 'express';

export const fakeAuthHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAuthenticated = Math.random() > 0.5;

  if (isAuthenticated) {
    res
      .status(200)
      .json({ message: 'Authenticated', data: { user: 'John Doe' } });
  } else {
    const error = new Error('Forbidden');
    res.status(403);
    next(error); // Pass the error to the next middleware
  }
};
