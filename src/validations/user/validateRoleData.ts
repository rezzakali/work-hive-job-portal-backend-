import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { HTTPSTATUS } from '../../config/http.config';

const validateRoleData = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isString()
    .withMessage('Invalid role'),
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

export default validateRoleData;
