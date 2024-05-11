import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const validateSigninData = [
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Invalid email address!'),
  body('password')
    .notEmpty()
    .withMessage('Password must be required!')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long!'),
  (req: Request, res: Response, next: NextFunction) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Return only the message of the first error
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ success: false, message: errorMessage });
    }
    next();
  },
];

export default validateSigninData;
