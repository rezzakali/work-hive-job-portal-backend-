import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';

/**
 * Middleware to check if the user's role is "employer".
 * If the user's role is not "employer", returns a 403 Forbidden error.
 */
const checkUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the user's role is "employer"

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (user && user.role === 'employer') {
    // User is an employer, proceed to the next middleware/route handler
    next();
  } else {
    // User is not an employer, return a 403 Forbidden error
    return res.status(403).json({
      success: false,
      message:
        'Access forbidden. Only employers can perform operation on jobs.',
    });
  }
};

export default checkUserRole;
