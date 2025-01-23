import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { HTTPSTATUS } from '../../config/http.config';

const validatePasswordChangeData = [
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Invalid email address!'),

  body('address')
    .notEmpty()
    .withMessage('Address is required!')
    .isObject()
    .withMessage('Address must be an object!')
    .custom((value) => {
      if (
        !value.street ||
        !value.city ||
        !value.state ||
        !value.postalCode ||
        !value.country
      ) {
        throw new Error('Invalid address format!');
      }
      return true;
    }),
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
