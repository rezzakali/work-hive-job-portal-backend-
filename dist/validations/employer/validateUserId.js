"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_config_1 = require("../../config/http.config");
const validateUserId = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('Invalid userId'),
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
exports.default = validateUserId;
