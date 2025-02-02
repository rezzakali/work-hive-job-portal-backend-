"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_env_1 = __importDefault(require("../utils/get-env"));
const appConfig = () => ({
    NODE_ENV: (0, get_env_1.default)('NODE_ENV', 'development'),
    PORT: (0, get_env_1.default)('PORT', '5000'),
    BASE_PATH: (0, get_env_1.default)('BASE_PATH', '/api/v1'),
    MONGO_URI: (0, get_env_1.default)('MONGO_URI'),
    MONGO_URI_ATLAS: (0, get_env_1.default)('MONGO_URI_ATLAS'),
    JWT: {
        SECRET: (0, get_env_1.default)('JWT_SECRET'),
        EXPIRES_IN: (0, get_env_1.default)('JWT_EXPIRES_IN', '30 days'),
    },
    COOKIE_EXPIRATION: (0, get_env_1.default)('COOKIE_EXPIRATION', '30'),
    SALT_ROUND: (0, get_env_1.default)('SALT_ROUND', '10'),
    IMAGEKIT_PUBLIC_KEY: (0, get_env_1.default)('IMAGEKIT_PUBLIC_KEY', ''),
    IMAGEKIT_PRIVATE_KEY: (0, get_env_1.default)('IMAGEKIT_PRIVATE_KEY', ''),
    IMAGEKIT_URL_ENDPOINT: (0, get_env_1.default)('IMAGEKIT_URL_ENDPOINT', ''),
    MAILER_SENDER: (0, get_env_1.default)('MAILER_SENDER'),
    MAILER_SENDER_PASSWORD: (0, get_env_1.default)('MY_PASSWORD'),
});
const config = appConfig();
exports.default = config;
