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
exports.saveFcmToken = exports.markNotificationRead = exports.getUnreadNotifications = exports.contactController = void 0;
const http_config_1 = require("../config/http.config");
const contact_1 = __importDefault(require("../models/contact"));
const fcmTokenModel_1 = __importDefault(require("../models/fcmTokenModel"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const error_1 = __importDefault(require("../utils/error"));
// contact controller
const contactController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { subject, email, description } = req.body;
        const newContact = new contact_1.default(req.body);
        // save to database
        yield newContact.save();
        // Send Email Notification
        // const mailOptions = {
        //   from: process.env.EMAIL_USER,
        //   to: process.env.ADMIN_EMAIL, // Your personal email
        //   subject: `New Contact Form Submission: ${subject}`,
        //   text: `You received a new message from ${email}.\n\nDescription:\n${description}`,
        // };
        // await transporter.sendMail(mailOptions);
        // return the response
        return res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ message: 'Message sent successfully', data: newContact });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.contactController = contactController;
// get unread notifications
const getUnreadNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const notifications = yield notificationModel_1.default.find({
            isReadBy: { $ne: req.user._id }, // Fetch only unread notifications
        })
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .skip(skip)
            .limit(Number(limit))
            .lean();
        res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ success: true, data: notifications || [] });
        next();
    }
    catch (error) {
        return next(new error_1.default((error === null || error === void 0 ? void 0 : error.message) || 'There was a server side error!', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getUnreadNotifications = getUnreadNotifications;
// get unread notifications
const markNotificationRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.body;
        if (!notificationId) {
            return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
                success: true,
                message: 'Notification Id is required!',
            });
        }
        yield notificationModel_1.default.updateOne({ _id: notificationId }, { $addToSet: { isReadBy: req.user._id } });
        res
            .status(200)
            .json({ success: true, message: 'Notification marked as read' });
        next();
    }
    catch (error) {
        return next(new error_1.default((error === null || error === void 0 ? void 0 : error.message) || 'There was a server side error!', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.markNotificationRead = markNotificationRead;
// save fcm token
const saveFcmToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const userId = req.user._id;
        if (!userId || !token) {
            return res
                .status(http_config_1.HTTPSTATUS.BAD_GATEWAY)
                .json({ message: 'User ID and token are required' });
        }
        // Check if token exists, update it if needed
        const existingToken = yield fcmTokenModel_1.default.findOne({ userId });
        if (existingToken) {
            existingToken.token = token;
            yield existingToken.save();
        }
        else {
            yield fcmTokenModel_1.default.create({ userId, token });
        }
        return res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ message: 'FCM token saved successfully' });
    }
    catch (error) {
        return next(new error_1.default((error === null || error === void 0 ? void 0 : error.message) || 'Internal server error!', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.saveFcmToken = saveFcmToken;
