"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addResumeController = exports.addAddressController = exports.passwordChange = exports.signinController = exports.signupController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = __importDefault(require("../config/app.config"));
const http_config_1 = require("../config/http.config");
const userModel_1 = __importDefault(require("../models/userModel"));
const error_1 = __importDefault(require("../utils/error"));
const imageUploadToImageKit_1 = __importDefault(require("../utils/imageUploadToImageKit"));
// signup controller
const signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // check if user already exists in the database
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            return next(new error_1.default('User already exists!', 403));
        }
        //   hashed password
        const hashedPassword = bcryptjs_1.default.hashSync(password, app_config_1.default.SALT_ROUND);
        const newUser = new userModel_1.default(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
        // finally save to database
        yield newUser.save();
        // send response
        res.status(http_config_1.HTTPSTATUS.CREATED).json({
            success: true,
            message: 'Thank you for registering! Your account has been successfully created.',
        });
        next();
    }
    catch (error) {
        return next(new error_1.default((error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.signupController = signupController;
// signin controller
const signinController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // destructure email and password from request body
        const { email, password } = req.body;
        // check user with the email
        const user = yield userModel_1.default.findOne({ email });
        // if no user
        if (!user) {
            return next(new error_1.default('Invalid credentials!', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        // compare the password
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
        // if the password is invalid
        if (!isValidPassword) {
            return next(new error_1.default('Invalid credentials!', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        // generate a jwt token
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_IN, // 30 days
        });
        res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            message: 'Login Successful: Welcome back to your account.',
            data: token,
        });
        next();
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.signinController = signinController;
// Password-change
const passwordChange = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, oldPassword, newPassword } = req.body;
        // check user with the email
        const user = yield userModel_1.default.findOne({ email });
        // if no user
        if (!user) {
            return next(new error_1.default('Invalid credentials', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        // Check if the current password is correct
        const isPasswordValid = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return next(new error_1.default('Incorrect old password', http_config_1.HTTPSTATUS.UNAUTHORIZED));
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, app_config_1.default.SALT_ROUND);
        // udpate the password
        user.password = hashedPassword;
        yield user.save();
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            message: 'Password changed successfully!',
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.passwordChange = passwordChange;
// Add Address
const addAddressController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, address } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        // if no user
        if (!user) {
            return next(new error_1.default('Invalid credentials!', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        user.address = address;
        yield user.save();
        res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            message: 'Address updated',
        });
        next();
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.addAddressController = addAddressController;
// Add Resume
const addResumeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new error_1.default('Email is required', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return next(new error_1.default('Invalid credentials', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        // upload image to imageKit platform
        const folderPath = 'users-resume';
        const imageUploadResponse = yield (0, imageUploadToImageKit_1.default)(req.file, folderPath);
        user.resume.url = imageUploadResponse === null || imageUploadResponse === void 0 ? void 0 : imageUploadResponse.url;
        user.resume.fileId = imageUploadResponse === null || imageUploadResponse === void 0 ? void 0 : imageUploadResponse.fileId;
        yield user.save();
        res.status(200).json({ success: true, message: 'Resume added' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.addResumeController = addResumeController;
