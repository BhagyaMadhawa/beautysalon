import { Router } from 'express';
import { signup, login, me, logout } from '../controllers/authController.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);

// Profile image upload route (no authentication required for signup)
router.post('https://beautysalon-qq6r.vercel.app/api/auth/upload/profile-image', upload.single('profile_image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
});

export default router;
