"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app_config_1 = __importDefault(require("./config/app.config"));
const cors_config_1 = __importDefault(require("./config/cors.config"));
const http_config_1 = require("./config/http.config");
const errorHandler_1 = __importDefault(require("./helpers/errorHandler"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
// base path
const BASE_PATH = app_config_1.default.BASE_PATH;
const app = (0, express_1.default)();
// morgan config
app.use((0, morgan_1.default)('tiny'));
// body-parser
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// cors-policy
app.use((0, cors_1.default)(cors_config_1.default));
// routes
app.use(`${BASE_PATH}/admin`, adminRoutes_1.default);
app.use(`${BASE_PATH}/auth`, authRoutes_1.default);
app.use(`${BASE_PATH}/jobs`, jobRoutes_1.default);
// customize error handler
app.use(errorHandler_1.default);
// default error
app.use((_err, req, res, next) => {
    if (res.headersSent) {
        return next();
    }
    res
        .status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR)
        .json({ error: 'There was a server side error!' });
});
exports.default = app;
