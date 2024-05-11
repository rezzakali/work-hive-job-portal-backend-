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
const jobController_1 = require("../controllers/jobController");
const superAdminController_1 = require("../controllers/superAdminController");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const validateRoleData_1 = __importDefault(require("../validations/user/validateRoleData"));
router.get('/users', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getAllUsers);
router.get('/users/:userId', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getUser);
router.patch('/users/change-role', checkAuth_1.default, isSuperAdmin_1.default, validateRoleData_1.default, superAdminController_1.changeRole);
router.delete('/users/:userId', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.deleteUser);
router.get('/jobs', checkAuth_1.default, isSuperAdmin_1.default, jobController_1.getJobsController);
router.get('/jobs/:id', checkAuth_1.default, isSuperAdmin_1.default, jobController_1.getJobsDetailsController);
router.delete('/jobs/:id', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.deleteJobController);
router.get('/applications', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.getAllApplications);
router.patch('/applications/status', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.updateApplicationStatus);
router.delete('/applications', checkAuth_1.default, isSuperAdmin_1.default, superAdminController_1.deleteApplication);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map