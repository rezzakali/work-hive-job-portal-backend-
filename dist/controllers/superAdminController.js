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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplicationStatus = exports.getAllApplications = exports.deleteJobController = exports.deleteUser = exports.changeRole = exports.getUser = exports.getAllUsers = void 0;
const applicationModel_1 = __importDefault(require("../models/applicationModel"));
const jobModel_1 = __importDefault(require("../models/jobModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const error_1 = __importDefault(require("../utils/error"));
// Get all users
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        const role = req.query.role;
        const sortBy = req.query.sortBy;
        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Build the query
        const query = {
            $and: [
                // Use $and to combine multiple conditions
                searchQuery
                    ? {
                        $or: [
                            { phone: { $regex: new RegExp(searchQuery, 'i') } },
                            { email: { $regex: new RegExp(searchQuery, 'i') } },
                        ],
                    }
                    : {},
                // Filter by role if provided
                role ? { role } : {},
            ],
        };
        let sortOptions = {};
        if (sortBy === 'asc') {
            sortOptions = { createdAt: 1 };
        }
        else {
            sortOptions = { createdAt: -1 };
        }
        // const fieldsToInclude = ['phone'];
        // Implementation to fetch all users
        const users = yield userModel_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();
        // Count total number of documents for pagination
        const totalUsers = yield userModel_1.default.countDocuments(query);
        // Calculate hasNext boolean for pagination
        const hasNext = totalUsers > skip + limit;
        const formattedUsers = users.map((user) => {
            const { password } = user, usersWithoutPassword = __rest(user, ["password"]);
            return usersWithoutPassword;
        });
        return res.status(200).json({
            success: true,
            count: totalUsers,
            hasNext,
            data: formattedUsers,
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.getAllUsers = getAllUsers;
// get user
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user) {
            return next(new error_1.default('User does not exists!', 404));
        }
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.getUser = getUser;
// role change controller
const changeRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, userId } = req.body;
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user) {
            return next(new error_1.default('User does not exists!', 404));
        }
        user.role = role;
        yield user.save();
        return res
            .status(200)
            .json({ success: true, message: `User role updated to ${role}` });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.changeRole = changeRole;
// delete a user controller
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next(new error_1.default('userId is required!', 400));
        }
        yield userModel_1.default.findByIdAndDelete({ _id: userId });
        return res
            .status(200)
            .json({ success: true, message: 'User deleted successfullly!' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.deleteUser = deleteUser;
// delete a job permanently
const deleteJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        yield jobModel_1.default.findByIdAndDelete({ _id: jobId });
        res.status(200).json({ success: true, message: 'Job deleted!' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.deleteJobController = deleteJobController;
// Get all applications with optional status filtering
const getAllApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.query.status;
        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        let query = {};
        // If statuses are provided, filter applications by those statuses
        if (status) {
            query.status = { $in: status };
        }
        // Implementation to fetch applications based on the query
        const applications = yield applicationModel_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .lean();
        // Count total number of documents for pagination
        const totalApplications = yield applicationModel_1.default.countDocuments(query);
        // Calculate hasNext boolean for pagination
        const hasNext = totalApplications > skip + limit;
        return res.status(200).json({
            success: true,
            count: applications.length,
            hasNext,
            data: applications,
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.getAllApplications = getAllApplications;
// Update application status
const updateApplicationStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, applicationId } = req.body;
        if (!applicationId) {
            return next(new error_1.default('Application id is required!', 400));
        }
        const application = yield applicationModel_1.default.findOne({ _id: applicationId });
        if (!application) {
            return next(new error_1.default('Application does not exists!', 404));
        }
        application.status = status;
        yield application.save();
        return res.status(200).json({
            success: true,
            message: `Applications status updated to ${status}`,
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
// delete an application permanently
const deleteApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = req.params;
        if (!applicationId) {
            return next(new error_1.default('Applicaton id is required!', 400));
        }
        yield applicationModel_1.default.findByIdAndDelete({ _id: applicationId });
        res.status(200).json({ success: true, message: 'Application deleted!' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, 500));
    }
});
exports.deleteApplication = deleteApplication;
//# sourceMappingURL=superAdminController.js.map