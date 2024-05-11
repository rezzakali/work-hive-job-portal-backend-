"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
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
            return res.status(400).json({ success: false, message: errorMessage });
        }
        next();
    },
];
exports.default = validatePasswordChangeData;
//# sourceMappingURL=validateAddAddressData.js.map