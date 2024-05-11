import { NextFunction, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';

const validateUserId = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId'),
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

export default validateUserId;
