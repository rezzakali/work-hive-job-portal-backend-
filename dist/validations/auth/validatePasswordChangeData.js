"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_config_1 = require("../../config/http.config");
const validatePasswordChangeData = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email is required!')
        .isEmail()
        .withMessage('Invalid email address!'),
    (0, express_validator_1.body)('oldPassword')
        .notEmpty()
        .withMessage('Password must be required!')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!'),
    (0, express_validator_1.body)('newPassword')
        .notEmpty()
        .withMessage('New password must be required!')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long!'),
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
exports.default = validatePasswordChangeData;
