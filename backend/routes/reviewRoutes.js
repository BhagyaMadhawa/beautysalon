import { Router } from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
  getReviewCategories
} from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/salons/:salonId/reviews', getReviews);
router.get('/salons/:salonId/reviews/stats', getReviewStats);
router.get('/reviews/categories', getReviewCategories);

// Protected routes (require authentication)
router.use(authenticateToken);
router.post('/salons/:salonId/reviews', createReview);
router.put('/reviews/:reviewId', updateReview);
router.delete('/reviews/:reviewId', deleteReview);

export default router;
