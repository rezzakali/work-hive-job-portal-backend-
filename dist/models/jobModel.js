"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
        default: 'full-time',
    },
    experienceLevel: {
        type: String,
        enum: ['entry-level', 'mid-level', 'senior-level'],
        default: 'entry-level',
    },
    skills: [
        {
            type: String,
            trim: true,
        },
    ],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Job = mongoose_1.default.model('Job', jobSchema);
exports.default = Job;
//# sourceMappingURL=jobModel.js.map