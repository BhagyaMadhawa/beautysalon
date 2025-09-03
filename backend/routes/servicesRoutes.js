import { Router } from 'express';
import { getServiceCategories } from '../controllers/servicesController.js';

const router = Router();

// Public – used for building filters; no auth needed
router.get('/categories', getServiceCategories);

export default router;
