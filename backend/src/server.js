import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { connectDB } from './lib/db.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ES Modules __dirname helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'client', 'dist'); 

// Middleware
app.use(cors({
  origin: 'https://chatguy-dfm6.onrender.com',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Serve frontend static files
app.use(express.static(CLIENT_BUILD_PATH));

// 🔴 FIX APPLIED HERE: Changed '/*' to '*' to avoid PathError on initialization.
// This serves the SPA index.html for all non-API and non-static file routes.
app.get('*', (req, res) => {
  // Important check: Do not interfere with API requests
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API Endpoint Not Found' });
  }
  res.sendFile(path.resolve(CLIENT_BUILD_PATH, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});