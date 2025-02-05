"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_config_1 = require("../config/http.config");
// Middleware function
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal Server Error';
    // MongoDB validation error
    if (err.name === 'ValidationError' && err.errors) {
        const errorMessages = Object.values(err.errors).map((val) => val.message);
        message = errorMessages.join(', ');
        statusCode = http_config_1.HTTPSTATUS.BAD_REQUEST || 400; // Bad Request
    }
    // Sending the error response
    res.status(statusCode).json({ success: false, message });
};
exports.default = errorHandler;
