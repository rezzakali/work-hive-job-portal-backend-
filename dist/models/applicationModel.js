"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const applicationSchema = new mongoose_1.default.Schema({
    jobId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resume: {
        url: String,
        fileId: String,
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'rejected', 'accepted'],
        default: 'pending',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});
const Application = mongoose_1.default.model('Application', applicationSchema);
exports.default = Application;
//# sourceMappingURL=applicationModel.js.map