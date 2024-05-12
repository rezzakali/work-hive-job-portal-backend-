import { Router } from 'express';

const router = Router();

// Middleware to check if user is a Super Admin
import isSuperAdmin from '../middleware/isSuperAdmin';

// Controller functions
import {
  getJobsController,
  getJobsDetailsController,
} from '../controllers/jobController';
import {
  changeRole,
  deleteApplication,
  deleteJobController,
  deleteUser,
  getAllApplications,
  getAllUsers,
  getUser,
  updateApplicationStatus,
} from '../controllers/superAdminController';
import checkAuth from '../middleware/checkAuth';
import validateRoleData from '../validations/user/validateRoleData';

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
router.get('/jobs/:id', checkAuth, isSuperAdmin, getJobsDetailsController);

router.delete('/jobs/:id', checkAuth, isSuperAdmin, deleteJobController);

router.get('/applications', checkAuth, isSuperAdmin, getAllApplications);

router.patch(
  '/applications/status',
  checkAuth,
  isSuperAdmin,
  updateApplicationStatus
);

router.delete('/applications', checkAuth, isSuperAdmin, deleteApplication);

export default router;
