// backend/server.js
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import proRoutes from './routes/proRoutes.js';
import ownerRoutes from "./routes/ownerRoutes.js";
import beautyProRoutes from './routes/beautyProRoutes.js';
import salonRoutes from './routes/salonRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// CORS configuration (no trailing slashes)
const allowedOrigins = [
  'https://beautysalon-orcin.vercel.app',
  'https://beautysalon-qq6r.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

// NOTE about uploads on Vercel:
// The runtime filesystem is read-only. Serving *existing, built-in* files is fine,
// but you cannot save new uploads to /backend/uploads at runtime.
// Consider S3/Cloudflare R2/Vercel Blob for user uploads.
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);

if (fs.existsSync(uploadsPath)) {
  console.log('Uploads directory exists');
  // Be careful: listing many files increases cold start time
  try {
    const files = fs.readdirSync(uploadsPath);
    console.log('Files in uploads directory (first 5):', files.slice(0, 5));
  } catch (e) {
    console.error('Error reading uploads directory:', e);
  }
} else {
  console.warn('Uploads directory does not exist at build/runtime.');
}

app.use(
  '/uploads',
  express.static(uploadsPath, { fallthrough: false })
);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pro', proRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/beauty-pro', beautyProRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes);
app.use('/api/services', servicesRoutes);

// Not found
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[UNCAUGHT ERROR]', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ❌ Do NOT call app.listen() on Vercel
export default app;
