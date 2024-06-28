import { Request, Response, NextFunction } from 'express';

export const handleForbiddenError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('check forbidden error');
  if (res.statusCode === 403) {
    res.status(403).json({
      message: 'Access forbidden: ' + err.message,
    });
  } else {
    next(err); // Pass the error to the next error handler if it's not a 403
  }
};
