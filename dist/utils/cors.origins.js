"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_config_1 = __importDefault(require("../config/app.config"));
const origins = app_config_1.default.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:5173'] // Development front-end origin and dashboard
    : [
        'https://job-portal-dashboard.vercel.app',
        'https://workshive.vercel.app',
        'https://workshive.netlify.app',
    ]; // Production front-end origin dashboard
exports.default = origins;
