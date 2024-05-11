import { NextFunction, Request, Response } from 'express';

// Define a type for the error object
interface CustomError extends Error {
  statusCode: number;
  name: string;
  errors?: {
    [key: string]: {
      message: string;
    };
  };
}

// Middleware function
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // MongoDB validation error
  if (err.name === 'ValidationError' && err.errors) {
    const errorMessages = Object.values(err.errors).map((val) => val.message);
    message = errorMessages.join(', ');
    statusCode = 400; // Bad Request
  }

  // Sending the error response
  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
