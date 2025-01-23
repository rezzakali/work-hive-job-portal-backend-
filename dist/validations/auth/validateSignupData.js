"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_config_1 = require("../../config/http.config");
// Validation checks using express-validator after multer
const validateSignupData = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email must be required!')
        .isEmail()
        .withMessage('Invalid email address!'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password must be required!')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be at least 8 characters long!'),
    (0, express_validator_1.body)('phone')
        .notEmpty()
        .withMessage('Phone is required!')
        .isMobilePhone('en-IN')
        .withMessage('Invalid phone number'),
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
exports.default = validateSignupData;
