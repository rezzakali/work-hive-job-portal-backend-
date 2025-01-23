"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Middleware to check if user is a Super Admin
const isSuperAdmin_1 = __importDefault(require("../middleware/isSuperAdmin"));
// Controller functions
const authController_1 = require("../controllers/authController");
const jobController_1 = require("../controllers/jobController");
const superAdminController_1 = require("../controllers/superAdminController");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const validateSigninData_1 = __importDefault(require("../validations/auth/validateSigninData"));
const validateRoleData_1 = __importDefault(require("../validations/user/validateRoleData"));
router.post('/signin', validateSigninData_1.default, authController_1.signinController);
router.get('/auth', checkAuth_1.default);
router.get('/users', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getAllUsers);
router.get('/users/:userId', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getUser);
router.patch('/users/change-role', checkAuth_1.default, isSuperAdmin_1.default, validateRoleData_1.default, superAdminController_1.changeRole);
router.delete('/users/:userId', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.deleteUser);
router.get('/jobs', checkAuth_1.default, isSuperAdmin_1.default, jobController_1.getJobsController);
// router.get('/jobs/:id', checkAuth, isSuperAdmin, getJobsDetailsController);
router.delete('/jobs/:id', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.deleteJobController);
router.patch('/jobs/change-status', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.ChangeJobStatusController);
router.get('/applications', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getAllApplications);
router.patch('/applications/status', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.updateApplicationStatus);
router.delete('/applications', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.deleteApplication);
// ################ Dashboard ####################
router.get('/dashboard/summery', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getDashboardSummaryController);
router.get('/dashboard/recent-jobs', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getDashboardRecentJobsController);
router.get('/dashboard/recent-applications', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getDashboardRecentApplicationsController);
router.get('/dashboard/top-companies', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getTopCompaniesController);
router.get('/dashboard/tasks-notifications', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getTasksNotificationsController);
router.get('/dashboard/applications-by-status', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getApplicationsByStatusController);
exports.default = router;
