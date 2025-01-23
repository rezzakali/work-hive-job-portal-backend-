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
    (0, express_validator_1.body)('address')
        .notEmpty()
        .withMessage('Address is required!')
        .isObject()
        .withMessage('Address must be an object!')
        .custom((value) => {
        if (!value.street ||
            !value.city ||
            !value.state ||
            !value.postalCode ||
            !value.country) {
            throw new Error('Invalid address format!');
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
exports.default = validatePasswordChangeData;
