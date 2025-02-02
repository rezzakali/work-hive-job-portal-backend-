import { Router } from 'express';
import { contactController } from '../controllers/generalController';
import contactValidation from '../validations/general/contactValidation';

const router = Router();

router.post('/contact', contactValidation, contactController);

export default router;
