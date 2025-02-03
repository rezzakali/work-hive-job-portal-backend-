import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config';
import { HTTPSTATUS } from '../config/http.config';
import ErrorResponse from '../utils/error';

// Extend Request type definition to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from cookie
    const token = Array.isArray(req.headers['x-access-token'])
      ? req.headers['x-access-token'][0]
      : req.headers['x-access-token'];

    if (!token) {
      return next(new ErrorResponse('Not Authenticated', HTTPSTATUS.FORBIDDEN));
    }
    try {
      const verified = jwt.verify(token, config.JWT.SECRET);
      req.user = verified;
      next();
    } catch (error) {
      return next(new ErrorResponse('Invalid Token', HTTPSTATUS.FORBIDDEN));
    }
  } catch (error) {
    return next(
      new ErrorResponse(
        error?.message || 'Access Denied!',
        HTTPSTATUS.FORBIDDEN
      )
    );
  }
};

export default checkAuth;
