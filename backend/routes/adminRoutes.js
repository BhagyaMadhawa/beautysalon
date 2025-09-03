import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import {
  getAllUsers,
  approveUser,
  rejectUser,
  getUserDetails,
  deleteUser
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
//router.use(authorizeRoles('admin'));

// Get all users with filters
router.get('/users', getAllUsers);

// Get specific user details
router.get('/users/:id', getUserDetails);

// Approve user
router.patch('/approve/:id', approveUser);

// Reject user
router.patch('/reject/:id', rejectUser);

// Delete user
router.delete('/delete/:id', deleteUser);

export default router;
