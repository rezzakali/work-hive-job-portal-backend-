"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_config_1 = require("../config/http.config");
const error_1 = __importDefault(require("../utils/error"));
const checkAuth = (req, res, next) => {
    try {
        // Extract token from cookie
        const token = Array.isArray(req.headers['x-access-token'])
            ? req.headers['x-access-token'][0]
            : req.headers['x-access-token'];
        if (!token) {
            return next(new error_1.default('Not Authenticated', http_config_1.HTTPSTATUS.FORBIDDEN));
        }
        // Verify token
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        return next(new error_1.default((error === null || error === void 0 ? void 0 : error.message) || 'Access Denied!', http_config_1.HTTPSTATUS.FORBIDDEN));
    }
};
exports.default = checkAuth;
