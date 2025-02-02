"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = __importDefault(require("./app.config"));
const allowedOrigins = app_config_1.default.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:5173'] // Development front-end origin and dashboard
    : ['https://job-portal-dashboard.vercel.app']; // Production front-end origin dashboard
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
exports.default = corsOptions;
