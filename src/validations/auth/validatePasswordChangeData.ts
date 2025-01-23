import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { HTTPSTATUS } from '../../config/http.config';

const validatePasswordChangeData = [
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Invalid email address!'),
  body('oldPassword')
    .notEmpty()
    .withMessage('Password must be required!')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long!'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password must be required!')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long!'),
  (req: Request, res: Response, next: NextFunction) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Return only the message of the first error
      const errorMessage = errors.array()[0].msg;
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, message: errorMessage });
    }
    next();
  },
];

export default validatePasswordChangeData;
