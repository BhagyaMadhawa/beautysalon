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

// ---- CORS ----
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

// ---- Static uploads (⚠ Vercel FS is read-only) ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads');

if (fs.existsSync(uploadsPath)) {
  console.log('Uploads dir exists');
  try {
    const files = fs.readdirSync(uploadsPath);
    console.log('Example files:', files.slice(0, 5));
  } catch (e) {
    console.error('Error reading uploads dir:', e);
  }
} else {
  console.warn('Uploads directory does not exist at runtime.');
}

app.use('/uploads', express.static(uploadsPath, { fallthrough: false }));

// ---- Health endpoints ----
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true })); // alias

// ---- Routes (use safeMount to debug bad files) ----
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

await safeMount('/auth',       () => import('./routes/authRoutes.js'));
await safeMount('/pro',        () => import('./routes/proRoutes.js'));
await safeMount('/owner',      () => import('./routes/ownerRoutes.js'));
await safeMount('/beauty-pro', () => import('./routes/beautyProRoutes.js'));
await safeMount('/salons',     () => import('./routes/salonRoutes.js'));
await safeMount('/admin',      () => import('./routes/adminRoutes.js'));
await safeMount('/reviews',    () => import('./routes/reviewRoutes.js'));
await safeMount('/services',   () => import('./routes/servicesRoutes.js'));

// ---- 404 + error handler ----
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error('[UNCAUGHT ERROR]', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ❌ Don’t call app.listen() on Vercel
export default app;
