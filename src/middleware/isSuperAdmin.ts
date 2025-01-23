import { NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import User from '../models/userModel';

const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (user && user.role === 'super-admin') {
    next();
  } else {
    return res.status(HTTPSTATUS.FORBIDDEN).json({
      success: false,
      message: 'Access forbidden. Only Admin can access',
    });
  }
};

export default isSuperAdmin;
