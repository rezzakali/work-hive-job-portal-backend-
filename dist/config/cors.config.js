"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = process.env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://localhost:3000'] // Development front-end origin and dashboard
    : ['https://job-portal-dashboard.vercel.app']; // Production front-end origin
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
