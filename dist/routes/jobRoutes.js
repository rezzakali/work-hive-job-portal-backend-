"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const checkUserRole_1 = __importDefault(require("../middleware/checkUserRole"));
const imageUploader_1 = __importDefault(require("../utils/imageUploader"));
const validateUserId_1 = __importDefault(require("../validations/employer/validateUserId"));
const validateApplicantStatusData_1 = __importDefault(require("../validations/jobs/validateApplicantStatusData"));
const validateJobData_1 = __importDefault(require("../validations/jobs/validateJobData"));
const validateUpdateJobData_1 = __importDefault(require("../validations/jobs/validateUpdateJobData"));
const router = (0, express_1.Router)();
// ############ GET JOBS #####################
// User can access
router.get('/', checkAuth_1.default, jobController_1.getJobsController);
// ############# GET JOB'S DETAILS #################
// User can access
router.get('/:id', checkAuth_1.default, jobController_1.getJobsDetailsController);
// ########### APPLY TO A JOB ###################
// User can access
router.post('/apply', checkAuth_1.default, imageUploader_1.default.single('file'), jobController_1.applyJobController);
// ################ POST A JOB #################
// Only employer can create a job
router.post('/create-job', checkAuth_1.default, checkUserRole_1.default, validateJobData_1.default, jobController_1.postAJobController);
// ############# GET THEIR OWN JOBS #################
router.get('/employer/:userId', checkAuth_1.default, checkUserRole_1.default, validateUserId_1.default, jobController_1.getEmployerJobsController);
// ################ UPDATE JOB ########################
// Only employer can access
router.patch('/', checkAuth_1.default, checkUserRole_1.default, validateUpdateJobData_1.default, jobController_1.updateJobController);
// ############### CLOSE/ARCHIEVE A JOB #####################
// Only employer can access
router.put('/:jobId/close', checkAuth_1.default, checkUserRole_1.default, jobController_1.closeJobController);
// ############### LIST OUT JOB-SEEKERS #####################
// Only employer can access
router.get('/:jobId/applicants', checkAuth_1.default, checkUserRole_1.default, jobController_1.getApplicantsController);
// ############### UPDATE APPLICANT STATUS #####################
// Only employer can access
router.patch('/applicant-status', checkAuth_1.default, checkUserRole_1.default, validateApplicantStatusData_1.default, jobController_1.updateApplicantStatusController);
// Check if user has applied for a job
router.get('/check-application/:jobId', checkAuth_1.default, jobController_1.checkApplicationStatus);
exports.default = router;
