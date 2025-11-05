// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

// Import routes
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { connectDB } from './lib/db.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Helper for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'client', 'dist'); // adjust path as per your project

// --- Middleware ---
app.use(cors({
  origin: 'https://chatguy-dfm6.onrender.com', // your frontend URL
  credentials: true, // allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// ----------------------------------------------------
// Serve frontend static files and handle SPA routing
// ----------------------------------------------------

// 1. Serve static files from the built client
app.use(express.static(CLIENT_BUILD_PATH));

// 2. Catch-all for SPA (React/Vite routes like /call/:id, /chat/:userId)
app.get('*', (req, res) => {
    // If request is for API, return 404
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API Endpoint Not Found' });
    }

    // Otherwise, serve index.html for SPA routing
    res.sendFile(path.resolve(CLIENT_BUILD_PATH, 'index.html'));
});

// ----------------------------------------------------
// Start server
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
