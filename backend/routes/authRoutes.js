import { Router } from 'express';
import { signup, login, me, logout } from '../controllers/authController.js';
import upload from '../middleware/upload.js';         // switches to memory storage in prod
import { put } from '@vercel/blob';                   // npm i @vercel/blob

const router = Router();

// Auth basics
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);

/**
 * POST /api/auth/upload/profile-image
 * form-data field name: "profile_image"
 */
router.post('/upload/profile-image', upload.single('profile_image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // In production (Vercel): upload the in-memory buffer to Blob storage
    if (process.env.NODE_ENV === 'production') {
      const safeName = (req.file.originalname || 'profile').replace(/\s+/g, '_');
      const key = `profiles/${Date.now()}-${safeName}`;

      const result = await put(key, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
      });

      // CDN-backed public URL
      return res.status(201).json({ url: result.url });
    }

    // Local dev: diskStorage wrote the file to /uploads
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error('profile-image upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
