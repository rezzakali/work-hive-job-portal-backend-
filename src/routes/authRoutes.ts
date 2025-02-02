import { Router } from 'express';
import {
  addAddressController,
  addResumeController,
  getProfile,
  logoutController,
  passwordChange,
  signinController,
  signupController,
} from '../controllers/authController';
import checkAuth from '../middleware/checkAuth';
import upload from '../utils/imageUploader';
import validateAddAddressData from '../validations/auth/validateAddAddressData';
import validatePasswordChangeData from '../validations/auth/validatePasswordChangeData';
import validateSigninData from '../validations/auth/validateSigninData';
import validateSignupData from '../validations/auth/validateSignupData';

const router = Router();

// signup
router.post('/signup', validateSignupData, signupController);

// signin
router.post('/signin', validateSigninData, signinController);

// password change
router.patch(
  '/password-change',
  checkAuth,
  validatePasswordChangeData,
  passwordChange
);

// logout
router.post('/logout', checkAuth, logoutController);

// get profile
router.get('/profile', checkAuth, getProfile);

// add address
router.patch(
  '/change-address',
  checkAuth,
  validateAddAddressData,
  addAddressController
);

// add resume
router.patch(
  '/add-resume',
  checkAuth,
  upload.single('file'),
  addResumeController
);

export default router;
