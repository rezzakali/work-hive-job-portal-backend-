import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const validateUpdateJobData = [
  body('jobId')
    .notEmpty()
    .withMessage('Job id is required!')
    .isMongoId()
    .withMessage('Invalid job id')
    .isString()
    .withMessage('Invalid job id'),
  body('data.title')
    .notEmpty()
    .withMessage('Title is required!')
    .isString()
    .withMessage('Title must be a string'),

  body('data.description')
    .notEmpty()
    .withMessage('Description is required!')
    .isString()
    .withMessage('Description must be a string'),

  body('data.company')
    .notEmpty()
    .withMessage('Company is required!')
    .isString()
    .withMessage('Company must be a string'),

  body('data.location')
    .notEmpty()
    .withMessage('Location is required!')
    .isString()
    .withMessage('Location must be a string'),

  body('data.salary').notEmpty().withMessage('Salary is required!'),

  body('data.employmentType')
    .isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    .withMessage('Invalid employment type'),

  body('data.experienceLevel')
    .isIn(['entry-level', 'mid-level', 'senior-level'])
    .withMessage('Invalid experience level'),

  body('data.skills')
    .optional()
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
      return res.status(400).json({ success: false, message: errorMessage });
    }
    next();
  },
];

export default validateUpdateJobData;
