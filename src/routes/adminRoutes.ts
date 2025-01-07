import { Router } from 'express';

const router = Router();

// Middleware to check if user is a Super Admin
import isSuperAdmin from '../middleware/isSuperAdmin';

// Controller functions
import { signinController } from '../controllers/authController';
import { getJobsController } from '../controllers/jobController';

import {
  ChangeJobStatusController,
  changeRole,
  deleteApplication,
  deleteJobController,
  deleteUser,
  getAllApplications,
  getAllUsers,
  getApplicationsByStatusController,
  getDashboardRecentApplicationsController,
  getDashboardRecentJobsController,
  getDashboardSummaryController,
  getTasksNotificationsController,
  getTopCompaniesController,
  getUser,
  updateApplicationStatus,
} from '../controllers/superAdminController';
import checkAuth from '../middleware/checkAuth';
import validateSigninData from '../validations/auth/validateSigninData';
import validateRoleData from '../validations/user/validateRoleData';

router.post('/signin', validateSigninData, signinController);

router.get('/auth', checkAuth);

router.get('/users', checkAuth, isSuperAdmin, getAllUsers);
router.get('/users/:userId', checkAuth, isSuperAdmin, getUser);
router.patch(
  '/users/change-role',
  checkAuth,
  isSuperAdmin,
  validateRoleData,
  changeRole
);

router.delete('/users/:userId', checkAuth, isSuperAdmin, deleteUser);

router.get('/jobs', checkAuth, isSuperAdmin, getJobsController);
// router.get('/jobs/:id', checkAuth, isSuperAdmin, getJobsDetailsController);

router.delete('/jobs/:id', checkAuth, isSuperAdmin, deleteJobController);
router.patch(
  '/jobs/change-status',
  checkAuth,
  isSuperAdmin,
  ChangeJobStatusController
);

router.get('/applications', checkAuth, isSuperAdmin, getAllApplications);

router.patch(
  '/applications/status',
  checkAuth,
  isSuperAdmin,
  updateApplicationStatus
);

router.delete('/applications', checkAuth, isSuperAdmin, deleteApplication);

// ################ Dashboard ####################
router.get(
  '/dashboard/summery',
  checkAuth,
  isSuperAdmin,
  getDashboardSummaryController
);

router.get(
  '/dashboard/recent-jobs',
  checkAuth,
  isSuperAdmin,
  getDashboardRecentJobsController
);

router.get(
  '/dashboard/recent-applications',
  checkAuth,
  isSuperAdmin,
  getDashboardRecentApplicationsController
);

router.get(
  '/dashboard/top-companies',
  checkAuth,
  isSuperAdmin,
  getTopCompaniesController
);

router.get(
  '/dashboard/tasks-notifications',
  checkAuth,
  isSuperAdmin,
  getTasksNotificationsController
);

router.get(
  '/dashboard/applications-by-status',
  checkAuth,
  isSuperAdmin,
  getApplicationsByStatusController
);

export default router;
