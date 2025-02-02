import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { HTTPSTATUS } from '../../config/http.config';

const validateJobData = [
  body('title')
    .notEmpty()
    .withMessage('Title is required!')
    .isString()
    .withMessage('Title must be a string'),

  body('description')
    .notEmpty()
    .withMessage('Description is required!')
    .isString()
    .withMessage('Description must be a string'),

  body('company')
    .notEmpty()
    .withMessage('Company is required!')
    .isString()
    .withMessage('Company must be a string'),

  body('location')
    .notEmpty()
    .withMessage('Location is required!')
    .isString()
    .withMessage('Location must be a string'),

  body('salary').notEmpty().withMessage('Salary is required!'),

  body('employmentType')
    .isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    .withMessage('Invalid employment type'),

  body('experienceLevel')
    .isIn(['entry-level', 'mid-level', 'senior-level'])
    .withMessage('Invalid experience level'),

  body('skills')
    .notEmpty()
    .withMessage('Skills is required!')
    .isArray()
    .withMessage('Skills must be an array')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required')
    .custom((value) => {
      // Validate each skill in the array
      for (const skill of value) {
        if (typeof skill !== 'string') {
          throw new Error('Each skill must be a string');
        }
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

export default validateJobData;
