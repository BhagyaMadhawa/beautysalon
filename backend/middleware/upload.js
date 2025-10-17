// backend/middleware/upload.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use disk storage locally; memory storage in production (Vercel)
const isProd = process.env.NODE_ENV === 'production';

let storage;

if (isProd) {
  // Vercel: read-only filesystem – store in memory and upload elsewhere
  storage = multer.memoryStorage();
} else {
  // Local dev: keep writing to ./uploads
  const uploadDir = path.join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.warn('Could not create uploads dir:', e);
  }

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '');
      cb(null, `image_${Date.now()}${ext}`);
    },
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
