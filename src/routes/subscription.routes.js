import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); 

// Toggle Subscription
router.post("/toggle/:channelId", toggleSubscription);

// Get Subscribers of a Channel
router.get("/channel/:channelId", getUserChannelSubscribers);

// Get Channels a User Subscribed To
router.get("/user/:userId", getSubscribedChannels);

export default router;
