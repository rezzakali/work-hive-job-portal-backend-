"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dbConnection_1 = __importDefault(require("../src/config/dbConnection"));
const errorHandler_1 = __importDefault(require("./helpers/errorHandler"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
// environment config
dotenv_1.default.config();
// PORT & HOST_NAME
const PORT = Number(process.env.PORT) || 5000;
const HOST_NAME = process.env.HOST_NAME || 'localhost';
// db config
(0, dbConnection_1.default)();
const app = (0, express_1.default)();
// morgan config
app.use((0, morgan_1.default)('dev'));
// body-parser
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// cors-policy
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    origin: 'http://localhost:5173',
}));
// routes
app.use('/api/v1/admin', adminRoutes_1.default);
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/jobs', jobRoutes_1.default);
// customize error handler
app.use(errorHandler_1.default);
// default error
app.use((_err, req, res, next) => {
    if (res.headersSent) {
        return next();
    }
    res.status(500).json({ error: 'There was a server side error!' });
});
// listening the server
app.listen(PORT, HOST_NAME, () => {
    console.log(`Your server is running successfully on http://${HOST_NAME}:${PORT}`);
});
//# sourceMappingURL=index.js.map