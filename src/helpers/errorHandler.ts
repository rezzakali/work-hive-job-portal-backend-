import { NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';

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
  let statusCode = err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  // MongoDB validation error
  if (err.name === 'ValidationError' && err.errors) {
    const errorMessages = Object.values(err.errors).map((val) => val.message);
    message = errorMessages.join(', ');
    statusCode = HTTPSTATUS.BAD_REQUEST || 400; // Bad Request
  }

  // Sending the error response
  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
