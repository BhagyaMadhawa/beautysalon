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

// CORS configuration for multiple origins
const allowedOrigins = [
  'https://beautysalon-orcin.vercel.app/',
  'https://beautysalon-qq6r.vercel.app/',
  'http://localhost:5173', // for local development
  'http://localhost:3000',
  'http://localhost:5000',
  'https://beautysalon-orcin.vercel.app/'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: log the uploads directory path
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);

// Check if the uploads directory exists
import fs from 'fs';
if (fs.existsSync(uploadsPath)) {
  console.log('Uploads directory exists');

  // List files in uploads directory for debugging
  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
    } else {
      console.log('Files in uploads directory:', files.slice(0, 5)); // Show first 5 files
    }
  });
} else {
  console.error('Uploads directory does not exist!');
}

// Serve static files from uploads directory using absolute path
app.use('/uploads', express.static(uploadsPath, {
  fallthrough: false // Don't fall through to next middleware if file not found
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pro', proRoutes);
app.use("/api/owner", ownerRoutes);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
