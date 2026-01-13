import express from "express"
import { getStreamToken } from "../controllers/chatControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// api/chat/token  => to get token of chatting
router.get("/token", protectRoute, getStreamToken)

export default router;