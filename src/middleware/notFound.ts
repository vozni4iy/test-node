import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, _next: NextFunction) => {
  console.log('not found check');
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    message: error.message,
  });
};

export default notFound;
