import express from 'express';

import { portectRoute } from '../middleware/authMiddleware.js';
import { getStreamToken } from '../controllers/chatController.js';

const router = express.Router();

router.get('/token',portectRoute,getStreamToken);

export default router;