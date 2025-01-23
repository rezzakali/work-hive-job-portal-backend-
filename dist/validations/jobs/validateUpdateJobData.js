"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_config_1 = require("../../config/http.config");
const validateUpdateJobData = [
    (0, express_validator_1.body)('jobId')
        .notEmpty()
        .withMessage('Job id is required!')
        .isMongoId()
        .withMessage('Invalid job id')
        .isString()
        .withMessage('Invalid job id'),
    (0, express_validator_1.body)('data.title')
        .notEmpty()
        .withMessage('Title is required!')
        .isString()
        .withMessage('Title must be a string'),
    (0, express_validator_1.body)('data.description')
        .notEmpty()
        .withMessage('Description is required!')
        .isString()
        .withMessage('Description must be a string'),
    (0, express_validator_1.body)('data.company')
        .notEmpty()
        .withMessage('Company is required!')
        .isString()
        .withMessage('Company must be a string'),
    (0, express_validator_1.body)('data.location')
        .notEmpty()
        .withMessage('Location is required!')
        .isString()
        .withMessage('Location must be a string'),
    (0, express_validator_1.body)('data.salary').notEmpty().withMessage('Salary is required!'),
    (0, express_validator_1.body)('data.employmentType')
        .isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship'])
        .withMessage('Invalid employment type'),
    (0, express_validator_1.body)('data.experienceLevel')
        .isIn(['entry-level', 'mid-level', 'senior-level'])
        .withMessage('Invalid experience level'),
    (0, express_validator_1.body)('data.skills')
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
    (req, res, next) => {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            // Return only the message of the first error
            const errorMessage = errors.array()[0].msg;
            return res
                .status(http_config_1.HTTPSTATUS.BAD_REQUEST)
                .json({ success: false, message: errorMessage });
        }
        next();
    },
];
exports.default = validateUpdateJobData;
