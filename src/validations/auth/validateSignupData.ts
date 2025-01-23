import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { HTTPSTATUS } from '../../config/http.config';

// Validation checks using express-validator after multer
const validateSignupData = [
  body('email')
    .notEmpty()
    .withMessage('Email must be required!')
    .isEmail()
    .withMessage('Invalid email address!'),

  body('password')
    .notEmpty()
    .withMessage('Password must be required!')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be at least 8 characters long!'),
  body('phone')
    .notEmpty()
    .withMessage('Phone is required!')
    .isMobilePhone('en-IN')
    .withMessage('Invalid phone number'),
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

export default validateSignupData;
