"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// multer store
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Check the file's MIME type
    const allowedMimeTypes = ['application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        // Accept the file
        cb(null, true);
    }
    else {
        // Reject the file
        cb(new Error('Unsupported file type!'), false);
    }
};
const limits = {
    fileSize: 1000000, // 1MB
};
const upload = (0, multer_1.default)({ storage, limits, fileFilter });
exports.default = upload;
