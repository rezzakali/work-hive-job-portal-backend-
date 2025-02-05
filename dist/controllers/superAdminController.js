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
exports.getApplicationsByStatusController = exports.getTasksNotificationsController = exports.getTopCompaniesController = exports.getDashboardRecentApplicationsController = exports.getDashboardRecentJobsController = exports.getDashboardSummaryController = exports.ChangeJobStatusController = exports.deleteApplication = exports.updateApplicationStatus = exports.getAllApplications = exports.deleteJobController = exports.deleteUser = exports.changeRole = exports.getUser = exports.getAllUsers = void 0;
const http_config_1 = require("../config/http.config");
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
        res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            count: totalUsers,
            hasNext,
            data: formattedUsers,
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getAllUsers = getAllUsers;
// get user
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user) {
            return next(new error_1.default('User does not exists!', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        return res.status(http_config_1.HTTPSTATUS.OK).json({ success: true, data: user });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getUser = getUser;
// role change controller
const changeRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, userId } = req.body;
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user) {
            return next(new error_1.default('User does not exists!', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        user.role = role;
        yield user.save();
        return res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ success: true, message: `User role updated to ${role}` });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.changeRole = changeRole;
// delete a user controller
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next(new error_1.default('userId is required!', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        yield userModel_1.default.findByIdAndDelete({ _id: userId });
        return res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ success: true, message: 'User deleted successfullly!' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.deleteUser = deleteUser;
// delete a job permanently
const deleteJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        yield jobModel_1.default.findByIdAndDelete({ _id: jobId });
        res.status(http_config_1.HTTPSTATUS.OK).json({ success: true, message: 'Job deleted!' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.deleteJobController = deleteJobController;
// Get all applications with optional status filtering
const getAllApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const limit = parseInt(req.query.limit as string, 10) || 10;
    //   const page = parseInt(req.query.page as string, 10) || 1;
    //   const status = req.query.status as
    //     | 'pending'
    //     | 'reviewed'
    //     | 'rejected'
    //     | 'accepted'
    //     | undefined;
    //   // const searchQuery = req.query.search as string | undefined;
    //   const sortField = req.query.sortField as string | 'appliedAt';
    //   const sortValue = req.query.sortValue as '1' | '-1' | undefined;
    //   // Calculate skip value for pagination
    //   const skip = (page - 1) * limit;
    //   let query: any = {};
    //   // If statuses are provided, filter applications by those statuses
    //   if (status) {
    //     query.status = { $in: Array.isArray(status) ? status : [status] };
    //   }
    //   // Count total number of documents for pagination
    //   const totalApplications = await Application.countDocuments(query);
    //   // Calculate hasNext boolean for pagination
    //   const hasNext = totalApplications > skip + limit;
    //   // Build sort options based on sortBy query parameter
    //   let sortOptions: { [key: string]: 1 | -1 } = {};
    //   if (sortField && (sortValue === '1' || sortValue === '-1')) {
    //     sortOptions[sortField] = parseInt(sortValue) as 1 | -1;
    //   }
    //   const applications = await Application.aggregate([
    //     { $match: query },
    //     {
    //       $lookup: {
    //         from: 'jobs',
    //         localField: 'jobId',
    //         foreignField: '_id',
    //         as: 'jobDetails',
    //       },
    //     },
    //     {
    //       $unwind: '$jobDetails',
    //     },
    //     {
    //       $lookup: {
    //         from: 'users',
    //         localField: 'userId',
    //         foreignField: '_id',
    //         as: 'userDetails',
    //       },
    //     },
    //     {
    //       $unwind: '$userDetails',
    //     },
    //     {
    //       $group: {
    //         _id: '$jobId',
    //         jobTitle: { $first: '$jobDetails.title' },
    //         company: { $first: '$jobDetails.company' },
    //         status: { $first: '$jobDetails.status' },
    //         applicants: {
    //           $push: {
    //             email: '$userDetails.email',
    //             phone: '$userDetails.phone',
    //             resume: '$resume.url',
    //             status: '$status',
    //           },
    //         },
    //         applicantsCount: { $sum: 1 },
    //       },
    //     },
    //     {
    //       $skip: skip,
    //     },
    //     {
    //       $limit: limit,
    //     },
    //     {
    //       $sort: sortOptions,
    //     },
    //   ]);
    //   res
    //     .status(HTTPSTATUS.OK)
    //     .json({ success: true, hasNext, count: totalApplications, applications });
    // } catch (error) {
    //   console.error('Error fetching applications:', error);
    //   return next(new ErrorResponse(error?.message, HTTPSTATUS.INTERNAL_SERVER_ERROR));
    // }
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        const status = req.query.status;
        // const searchQuery = req.query.search as string | undefined;
        const sortField = req.query.sortField;
        const sortValue = req.query.sortValue;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        let query = {};
        // If statuses are provided, filter applications by those statuses
        if (status) {
            query.status = { $in: Array.isArray(status) ? status : [status] };
        }
        // Count total number of documents for pagination
        const totalApplications = yield applicationModel_1.default.countDocuments(query);
        // Calculate hasNext boolean for pagination
        const hasNext = totalApplications > skip + limit;
        // Build sort options based on sortBy query parameter
        let sortOptions = {};
        if (sortField && (sortValue === '1' || sortValue === '-1')) {
            sortOptions[sortField] = parseInt(sortValue);
        }
        const applications = yield applicationModel_1.default.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobId',
                    foreignField: '_id',
                    as: 'jobDetails',
                },
            },
            {
                $unwind: '$jobDetails',
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails',
            },
            {
                $group: {
                    _id: '$jobId',
                    jobTitle: { $first: '$jobDetails.title' },
                    company: { $first: '$jobDetails.company' },
                    status: { $first: '$jobDetails.status' },
                    applicants: {
                        $push: {
                            email: '$userDetails.email',
                            phone: '$userDetails.phone',
                            resume: '$resume.url',
                            status: '$status',
                        },
                    },
                    applicantsCount: { $sum: 1 },
                },
            },
            {
                $sort: sortOptions,
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);
        res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            applications,
            totalApplications,
            hasNext,
            currentPage: page,
            totalPages: Math.ceil(totalApplications / limit),
        });
    }
    catch (error) {
        console.error('Error fetching applications:', error);
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getAllApplications = getAllApplications;
// Update application status
const updateApplicationStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, applicationId } = req.body;
        if (!applicationId) {
            return next(new error_1.default('Application id is required!', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        const application = yield applicationModel_1.default.findOne({ _id: applicationId });
        if (!application) {
            return next(new error_1.default('Application does not exists!', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        application.status = status;
        yield application.save();
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            message: `Applications status updated to ${status}`,
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
// delete an application permanently
const deleteApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = req.params;
        if (!applicationId) {
            return next(new error_1.default('Applicaton id is required!', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        yield applicationModel_1.default.findByIdAndDelete({ _id: applicationId });
        res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ success: true, message: 'Application deleted!' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.deleteApplication = deleteApplication;
// change job's status
const ChangeJobStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, status } = req.body;
        if (!jobId) {
            return next(new error_1.default('jobId is required!', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        // Find the job by ID
        const job = yield jobModel_1.default.findOne({ _id: jobId });
        if (!job) {
            return res
                .status(http_config_1.HTTPSTATUS.NOT_FOUND)
                .json({ success: false, message: 'Job not found' });
        }
        // Update the job status
        job.status = status;
        yield job.save();
        res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ success: true, message: 'Job status changed successfully' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.ChangeJobStatusController = ChangeJobStatusController;
// for dashboard
const getDashboardSummaryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalJobs, totalUsers, totalCompanies, totalApplicants, openJobs, closedJobs, pendingApplications, reviewedApplications, acceptedApplications, rejectedApplications,] = yield Promise.all([
            jobModel_1.default.countDocuments(),
            userModel_1.default.countDocuments(),
            userModel_1.default.countDocuments({ role: 'employer' }),
            applicationModel_1.default.countDocuments(),
            jobModel_1.default.countDocuments({ status: 'open' }),
            jobModel_1.default.countDocuments({ status: 'closed' }),
            applicationModel_1.default.countDocuments({ status: 'pending' }),
            applicationModel_1.default.countDocuments({ status: 'reviewed' }),
            applicationModel_1.default.countDocuments({ status: 'accepted' }),
            applicationModel_1.default.countDocuments({ status: 'rejected' }),
        ]);
        // Format the data for the dashboard
        const formattedData = [
            {
                title: 'Total Jobs',
                count: totalJobs,
            },
            {
                title: 'Open Jobs',
                count: openJobs,
            },
            {
                title: 'Closed Jobs',
                count: closedJobs,
            },
            {
                title: 'Total Users',
                count: totalUsers,
            },
            {
                title: 'Companies/Employers',
                count: totalCompanies,
            },
            {
                title: 'Total Applicants',
                count: totalApplicants,
            },
            {
                title: 'Pending Applications',
                count: pendingApplications,
            },
            {
                title: 'Reviewed Applications',
                count: reviewedApplications,
            },
            {
                title: 'Accepted Applications',
                count: acceptedApplications,
            },
            {
                title: 'Rejected Applications',
                count: rejectedApplications,
            },
        ];
        // Send the formatted data in the response
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            data: formattedData,
        });
    }
    catch (error) {
        console.error('Error fetching dashboard summary:', error);
        return next(new error_1.default('Failed to fetch dashboard summary', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getDashboardSummaryController = getDashboardSummaryController;
const getDashboardRecentJobsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield jobModel_1.default.find({ status: 'open' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title company createdAt status')
            .lean();
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            status: true,
            data: jobs,
        });
    }
    catch (error) {
        return next(new error_1.default('Failed to fetch dashboard recent jobs', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getDashboardRecentJobsController = getDashboardRecentJobsController;
const getDashboardRecentApplicationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield applicationModel_1.default.find({})
            .sort({ appliedAt: -1 })
            .populate({
            path: 'userId',
            select: 'email -_id',
        })
            .populate({
            path: 'jobId',
            select: 'title -_id',
        })
            .limit(5)
            .select('-resume')
            .lean();
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            status: true,
            data: applications,
        });
    }
    catch (error) {
        return next(new error_1.default('Failed to fetch dashboard recent applications', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getDashboardRecentApplicationsController = getDashboardRecentApplicationsController;
const getTopCompaniesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the limit for the number of top companies to fetch
        // const limit = parseInt(req.query.limit as string, 10) || 10;
        // Aggregate the data to get the top companies based on job count
        const topCompanies = yield jobModel_1.default.aggregate([
            {
                $group: {
                    _id: '$company',
                    jobs: { $sum: 1 }, // Count the number of jobs per company
                },
            },
            {
                $sort: { jobs: -1 }, // Sort by job count in descending order
            },
            {
                $limit: 5, // Limit the number of companies returned
            },
        ]);
        // Return the top companies
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            data: topCompanies,
        });
    }
    catch (error) {
        console.error('Error fetching top companies:', error);
        return next(new error_1.default('Failed to fetch top companies', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getTopCompaniesController = getTopCompaniesController;
const getTasksNotificationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch pending applications
        const pendingApplications = yield applicationModel_1.default.find({ status: 'pending' })
            .populate({ path: 'jobId', select: 'title -_id' })
            .select('createdAt');
        // Build the response data
        // const tasksNotifications = {
        //   pendingApplications,
        // };
        // Return the tasks/notifications
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            data: pendingApplications,
        });
    }
    catch (error) {
        console.error('Error fetching tasks/notifications:', error);
        return next(new error_1.default('Failed to fetch tasks/notifications', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getTasksNotificationsController = getTasksNotificationsController;
const getApplicationsByStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicationsByStatus = yield applicationModel_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    status: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);
        return res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            data: applicationsByStatus,
        });
    }
    catch (error) {
        console.error('Error fetching applications by status:', error);
        return next(new error_1.default('Failed to fetch applications by status', http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getApplicationsByStatusController = getApplicationsByStatusController;
