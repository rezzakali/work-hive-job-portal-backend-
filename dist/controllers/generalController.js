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
exports.contactController = void 0;
const http_config_1 = require("../config/http.config");
const contact_1 = __importDefault(require("../models/contact"));
const error_1 = __importDefault(require("../utils/error"));
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
