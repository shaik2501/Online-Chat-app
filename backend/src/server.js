import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import cors from "cors";
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://chatguy-dfm6.onrender.com', // your deployed frontend
  credentials: true, // allow cookies to be sent
}));


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/chat',chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});