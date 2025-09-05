// backend/server.js
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
  })
);

// ---- Static uploads (note: Vercel is read-only at runtime) ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);

if (fs.existsSync(uploadsPath)) {
  try {
    const files = fs.readdirSync(uploadsPath);
    console.log('Uploads dir exists. Example files:', files.slice(0, 5));
  } catch (e) {
    console.error('Error reading uploads dir:', e);
  }
} else {
  console.warn('Uploads directory does not exist at runtime.');
}

app.use(
  '/uploads',
  express.static(uploadsPath, { fallthrough: false })
);

// ---- Health route ----
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ---- Dynamically mount your route modules ----
async function safeMount(path, loader) {
  try {
    const mod = await loader();
    const router = mod.default || mod;
    app.use(path, router);
    console.log(`[mount] OK ${path}`);
  } catch (e) {
    console.error(`[mount] FAILED ${path}:`, e);
  }
}

// Use top-level await (Node 18+ supports it in ES modules)
await safeMount('/api/auth',       () => import('./routes/authRoutes.js'));
await safeMount('/api/pro',        () => import('./routes/proRoutes.js'));
await safeMount('/api/owner',      () => import('./routes/ownerRoutes.js'));
await safeMount('/api/beauty-pro', () => import('./routes/beautyProRoutes.js'));
await safeMount('/api/salons',     () => import('./routes/salonRoutes.js'));
await safeMount('/api/admin',      () => import('./routes/adminRoutes.js'));
await safeMount('/api',            () => import('./routes/reviewRoutes.js'));
await safeMount('/api/services',   () => import('./routes/servicesRoutes.js'));

// ---- Fallbacks ----
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error('[UNCAUGHT ERROR]', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ❌ Do NOT call app.listen() on Vercel
export default app;
