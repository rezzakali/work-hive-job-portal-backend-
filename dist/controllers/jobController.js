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
exports.updateApplicantStatusController = exports.getApplicantsController = exports.getEmployerJobsController = exports.closeJobController = exports.applyJobController = exports.updateJobController = exports.postAJobController = exports.getJobsDetailsController = exports.getJobsController = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const http_config_1 = require("../config/http.config");
const applicationModel_1 = __importDefault(require("../models/applicationModel"));
const jobModel_1 = __importDefault(require("../models/jobModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const error_1 = __importDefault(require("../utils/error"));
const imageUploadToImageKit_1 = __importDefault(require("../utils/imageUploadToImageKit"));
// Create a transporter using Gmail SMTP
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD, // Your Gmail password (Use App Password for better security)
    },
});
// GET JOBS
const getJobsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract search query, sort direction, limit, and page number from request query parameters
        const searchQuery = req.query.search;
        const sortField = req.query.sortField;
        const sortValue = req.query.sortValue;
        const status = req.query.status;
        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        const salaryRange = req.query.salaryRange;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Build the query
        const query = {
            $and: [
                // Use $and to combine multiple conditions
                searchQuery
                    ? {
                        $or: [
                            { title: { $regex: new RegExp(searchQuery, 'i') } },
                            { company: { $regex: new RegExp(searchQuery, 'i') } },
                            {
                                location: { $regex: new RegExp(searchQuery, 'i') },
                            },
                        ],
                    }
                    : {},
                status
                    ? {
                        status: status,
                    }
                    : {},
            ],
        };
        if (salaryRange && typeof salaryRange === 'string') {
            const [minSalary, maxSalary] = salaryRange
                .split('-')
                .map((value) => parseInt(value.replace('k', '')) * 1000);
            query.$and.push({ salary: { $gte: minSalary, $lte: maxSalary } });
        }
        // Clean up the query by removing empty objects
        const cleanedQuery = query.$and.filter((condition) => Object.keys(condition).length > 0);
        // If there are no conditions left, set query to an empty object
        if (cleanedQuery.length === 0) {
            delete query.$and;
        }
        else {
            query.$and = cleanedQuery;
        }
        // Build sort options based on sortBy query parameter
        let sortOptions = {};
        if (sortField && (sortValue === '1' || sortValue === '-1')) {
            sortOptions[sortField] = parseInt(sortValue);
        }
        // Specify the fields to include in the response
        const fieldsToInclude = [
            'title',
            'company',
            'location',
            'salary',
            'createdAt',
            'updatedAt',
            'description',
            'skills',
            'status',
            'employmentType',
            'experienceLevel',
            'createdBy',
        ];
        // Fetch jobs from the database with search, sort, limit, and pagination options
        const jobs = yield jobModel_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .select(fieldsToInclude)
            .populate({
            path: 'createdBy',
            select: 'email -_id', // Include only 'email' and exclude '_id'
        })
            .lean();
        // Count total number of documents for pagination
        const totalJobs = yield jobModel_1.default.countDocuments(query);
        // Calculate hasNext boolean for pagination
        const hasNext = totalJobs > skip + limit;
        res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            count: totalJobs,
            hasNext,
            data: jobs,
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getJobsController = getJobsController;
// GET A JOB
const getJobsDetailsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new error_1.default('Id is required to see job details', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        const job = yield jobModel_1.default.findById(id);
        if (!job) {
            return next(new error_1.default('Job does not exists', http_config_1.HTTPSTATUS.NOT_FOUND));
        }
        res.status(http_config_1.HTTPSTATUS.OK).json({ success: true, data: job });
        next();
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getJobsDetailsController = getJobsDetailsController;
// POST A JOB
const postAJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new job document
        const job = new jobModel_1.default(req.body);
        // Set createdBy field to the user's ID
        job.createdBy = req.user._id;
        // Save the job document
        yield job.save();
        res.status(http_config_1.HTTPSTATUS.CREATED).json({ success: true, data: job });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.postAJobController = postAJobController;
// UPDATE A JOB
const updateJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, data } = req.body;
        const updatedJob = yield jobModel_1.default.findByIdAndUpdate({ _id: jobId }, data, {
            new: true,
        });
        res.status(http_config_1.HTTPSTATUS.OK).json({ success: true, data: updatedJob });
        next();
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.updateJobController = updateJobController;
// APPLY JOB
const applyJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const jobId = req.body.jobId;
        // Check if the user has already applied to the job
        const existingApplication = yield applicationModel_1.default.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
                success: false,
                message: 'You have already applied to this job',
            });
        }
        const user = yield userModel_1.default.findById(userId);
        const job = yield jobModel_1.default.findById(jobId);
        if (!user) {
            return res
                .status(http_config_1.HTTPSTATUS.NOT_FOUND)
                .json({ success: false, message: 'User not found' });
        }
        let resumePath;
        if (user.resume.fileId && user.resume.fileId !== '') {
            resumePath = user.resume;
        }
        else {
            const folderPath = 'users-resume';
            const imageUploadResponse = yield (0, imageUploadToImageKit_1.default)(req.file, folderPath);
            if (!(imageUploadResponse === null || imageUploadResponse === void 0 ? void 0 : imageUploadResponse.url) || !(imageUploadResponse === null || imageUploadResponse === void 0 ? void 0 : imageUploadResponse.fileId)) {
                return res
                    .status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: 'Failed to apply on this job' });
            }
            user.resume.url = imageUploadResponse.url;
            user.resume.fileId = imageUploadResponse.fileId;
            yield user.save();
            resumePath = user.resume;
        }
        // Create a new application
        const newApplication = new applicationModel_1.default({
            jobId,
            userId,
            resume: resumePath,
        });
        // Save the application to the database
        yield newApplication.save();
        // Send email to the user
        // const mailOptions = {
        //   from: process.env.MY_EMAIL, // Your Gmail address
        //   to: user.email, // User's email address
        //   subject: 'Application Confirmation',
        //   html: `
        //     <p>Dear Applicant,</p>
        //     <p>We are pleased to inform you that your application for the position of ${job.title} at ${job.company} has been successfully received and is currently under review.</p>
        //     <p><strong>Application Details:</strong></p>
        //     <ul>
        //       <li><strong>Job Title:</strong> ${job.title}</li>
        //       <li><strong>Company:</strong> ${job.company}</li>
        //       <li><strong>Location:</strong> ${job.location}</li>
        //       <li><strong>Salary:</strong> ${job.salary}/month</li>
        //       <li><strong>Employment Type:</strong> ${job.employmentType}</li>
        //       <li><strong>Experience Level:</strong> ${job.experienceLevel}</li>
        //     </ul>
        //     <p><strong>Next Steps:</strong></p>
        //     <p>Our recruitment team is currently reviewing applications, and we will contact you directly if your qualifications match our requirements and you are selected for an interview.</p>
        //     <p>We appreciate your interest in joining our team at <strong>${job.company}</strong>.
        //     <p>Thank you once again for applying with us. We wish you the best of luck in your job search!</p>
        //     <p>Warm regards,</p>
        //     <p>${job.company}<br>${job.location}
        //   `,
        // };
        // await transporter.sendMail(mailOptions);
        res
            .status(http_config_1.HTTPSTATUS.CREATED)
            .json({ success: true, message: 'Successfully applied!' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.applyJobController = applyJobController;
// CLOSE A JOB
const closeJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.jobId;
        const userId = req.user._id;
        if (!jobId) {
            return next(new error_1.default('jobId is required!', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        // Find the job by ID and check if the authenticated user is the creator
        const job = yield jobModel_1.default.findOne({ _id: jobId, createdBy: userId });
        if (!job) {
            return res
                .status(http_config_1.HTTPSTATUS.NOT_FOUND)
                .json({ success: false, message: 'Job not found' });
        }
        // Update the job status to 'closed'
        job.status = 'closed';
        yield job.save();
        res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ success: true, message: 'Job closed successfully' });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.closeJobController = closeJobController;
// ################# GET EMPLOYERS JOBS
const getEmployerJobsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next(new error_1.default('userId is required!', http_config_1.HTTPSTATUS.BAD_REQUEST));
        }
        // Fetch all job listings created by the specific employer
        const jobs = yield jobModel_1.default.find({ createdBy: userId });
        if (!jobs || jobs.length === 0) {
            return res
                .status(http_config_1.HTTPSTATUS.NOT_FOUND)
                .json({ success: false, message: 'No jobs found for this employer!' });
        }
        res.status(http_config_1.HTTPSTATUS.OK).json({ success: true, data: jobs });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getEmployerJobsController = getEmployerJobsController;
// ######## FIND OUT APPLICANTS ################
const getApplicantsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all applications for the job and populate the userId field to get the applicant's details
        const applications = yield applicationModel_1.default.find({
            jobId: req.params.jobId,
        });
        if (applications.length === 0) {
            return res
                .status(http_config_1.HTTPSTATUS.NOT_FOUND)
                .json({ success: false, message: 'No applicants found for this job' });
        }
        // Extract applicant details with email ,phone and resume
        const applicants = [];
        for (const application of applications) {
            const user = yield userModel_1.default.findById(application.userId);
            if (user) {
                const { email, phone, resume } = user;
                applicants.push({ email, phone, resume });
            }
        }
        res.status(http_config_1.HTTPSTATUS.OK).json({ success: true, data: applicants });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getApplicantsController = getApplicantsController;
// ############ UPDATE APPLICANT STATUS ###############
const updateApplicantStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, userId, status } = req.body;
        // Validate employer's access to the job
        const job = yield jobModel_1.default.findById(jobId);
        if (!job || job.createdBy.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ success: false, message: 'Unauthorized access' });
        }
        // Find the application
        const application = yield applicationModel_1.default.findOne({ jobId, userId });
        // Find the user
        // const user = await User.findOne({ _id: userId });
        if (!application) {
            return res
                .status(http_config_1.HTTPSTATUS.NOT_FOUND)
                .json({ success: false, message: 'Application not found' });
        }
        // Update applicant status
        application.status = status;
        yield application.save();
        // Sending email after update the status
        //   const mailOptions = {
        //     from: process.env.MY_EMAIL, // Your Gmail address
        //     to: user.email, // User's email address
        //     subject: 'Application Status Updated',
        //     html: `
        //         <p>Your application status has been updated to: <strong>${status}</strong></p>
        //         <p>If you have any questions, please contact us.</p>
        //         <p>Thank you for applying!</p>
        //       `,
        //   };
        // await transporter.sendMail(mailOptions);
        res.status(http_config_1.HTTPSTATUS.OK).json({
            success: true,
            message: 'Applicant status updated successfully',
        });
    }
    catch (error) {
        return next(new error_1.default(error === null || error === void 0 ? void 0 : error.message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.updateApplicantStatusController = updateApplicantStatusController;
