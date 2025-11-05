import express from "express";

import { portectRoute } from "../middleware/authMiddleware.js";

import { getOutgoingFriendRequests,getFriendRequests,acceptFriendRequest,sendFriendRequest,getRecommendedUsers, getMyFriends } from "../controllers/userController.js";



const router = express.Router();

router.use(portectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingFriendRequests);

export default router;