import { Router } from 'express';
import {
  applyJobController,
  checkApplicationStatus,
  closeJobController,
  getApplicantsController,
  getEmployerJobsController,
  getJobsController,
  getJobsDetailsController,
  postAJobController,
  updateApplicantStatusController,
  updateJobController,
} from '../controllers/jobController';
import checkAuth from '../middleware/checkAuth';
import checkUserRole from '../middleware/checkUserRole';
import upload from '../utils/imageUploader';
import validateUserId from '../validations/employer/validateUserId';
import validateApplicantStatusData from '../validations/jobs/validateApplicantStatusData';
import validateJobData from '../validations/jobs/validateJobData';
import validateUpdateJobData from '../validations/jobs/validateUpdateJobData';

const router = Router();

// ############ GET JOBS #####################
// User can access
router.get('/', checkAuth, getJobsController);

// ############# GET JOB'S DETAILS #################
// User can access
router.get('/:id', checkAuth, getJobsDetailsController);

// ########### APPLY TO A JOB ###################
// User can access
router.post('/apply', checkAuth, upload.single('file'), applyJobController);

// ################ POST A JOB #################
// Only employer can create a job
router.post(
  '/create-job',
  checkAuth,
  checkUserRole,
  validateJobData,
  postAJobController
);

// ############# GET THEIR OWN JOBS #################
router.get(
  '/employer/:userId',
  checkAuth,
  checkUserRole,
  validateUserId,
  getEmployerJobsController
);

// ################ UPDATE JOB ########################
// Only employer can access
router.patch(
  '/',
  checkAuth,
  checkUserRole,
  validateUpdateJobData,
  updateJobController
);

// ############### CLOSE/ARCHIEVE A JOB #####################
// Only employer can access
router.put('/:jobId/close', checkAuth, checkUserRole, closeJobController);

// ############### LIST OUT JOB-SEEKERS #####################
// Only employer can access
router.get(
  '/:jobId/applicants',
  checkAuth,
  checkUserRole,
  getApplicantsController
);

// ############### UPDATE APPLICANT STATUS #####################
// Only employer can access
router.patch(
  '/applicant-status',
  checkAuth,
  checkUserRole,
  validateApplicantStatusData,
  updateApplicantStatusController
);

// Check if user has applied for a job
router.get('/check-application/:jobId', checkAuth, checkApplicationStatus);

export default router;
