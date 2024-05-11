"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Middleware function
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    // MongoDB validation error
    if (err.name === 'ValidationError' && err.errors) {
        const errorMessages = Object.values(err.errors).map((val) => val.message);
        message = errorMessages.join(', ');
        statusCode = 400; // Bad Request
    }
    // Sending the error response
    res.status(statusCode).json({ success: false, message });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map