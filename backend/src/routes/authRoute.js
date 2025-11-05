import express from 'express';


import { signup, login, logout } from '../controllers/authController.js';
import { portectRoute } from '../middleware/authMiddleware.js';
import { onboard } from '../controllers/authController.js';



const router = express.Router();

router.post('/signup',signup);
router.post('/login',login); 
router.post('/logout',logout);

router.post('/onboarding',portectRoute,onboard);

//this is to check if the user is authenticated and to get user details
router.get('/me',portectRoute,(req,res) => {
    res.status(200).json({success:true,user:req.user});
});


export default router;