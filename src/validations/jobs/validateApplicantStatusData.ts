import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const validateApplicantStatusData = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId'),
  body('jobId')
    .notEmpty()
    .withMessage('jobId is required')
    .isMongoId()
    .withMessage('Invalid jobId'),
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isString()
    .withMessage('Invalid status'),
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

export default validateApplicantStatusData;
