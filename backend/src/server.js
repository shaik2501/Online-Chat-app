// server.js (Adding a static folder and a fallback route)

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

// 🔴 NOTE: Ensure you import your routes correctly
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { connectDB } from './lib/db.js';

import path from 'path'; // Import path module
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Helper for ES Modules (if you're using 'type: module' in package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'client', 'dist'); // Adjust path as necessary for your setup

// --- Middleware ---
app.use(cors({
  origin: 'https://chatguy-dfm6.onrender.com',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/chat',chatRoutes);

// ----------------------------------------------------
// 🔴 FIX APPLIED HERE: Static files and Client Fallback
// ----------------------------------------------------

// 1. Serve static files from the built client application
app.use(express.static(CLIENT_BUILD_PATH));

// 2. Catch-all route to serve the client-side application for any unhandled routes.
// This is crucial for client-side routing like /call/:id
app.get('*', (req, res) => {
    // Check if the request is for an API endpoint that failed (just in case)
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API Endpoint Not Found' });
    }
    
    // Serve the index.html file for client-side routing
    res.sendFile(path.resolve(CLIENT_BUILD_PATH, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});