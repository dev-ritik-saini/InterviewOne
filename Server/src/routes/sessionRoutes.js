import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { createSession, endSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession, updateSessionProblem } from "../controllers/sessionController.js";
const router = express.Router();

router.post("/", protectRoute, createSession)
router.get("/active", protectRoute, getActiveSessions)
router.get("/my-recent", protectRoute, getMyRecentSessions)

router.get("/:id", protectRoute, getSessionById)
router.post("/:id/join", protectRoute, joinSession)
router.patch("/:id/problem", protectRoute, updateSessionProblem)
router.delete("/:id/end", protectRoute, endSession)

export default router;