import { Router } from 'express';
import {
  contactController,
  getUnreadNotifications,
  markNotificationRead,
} from '../controllers/generalController';
import checkAuth from '../middleware/checkAuth';
import contactValidation from '../validations/general/contactValidation';

const router = Router();

router.post('/contact', contactValidation, contactController);

router.get('/notifications/unread', checkAuth, getUnreadNotifications);

router.put('/notifications/mark-read', checkAuth, markNotificationRead);

export default router;
