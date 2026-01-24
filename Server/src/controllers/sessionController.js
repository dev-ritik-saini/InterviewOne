import { Session } from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

// ===> Creating a session 
export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body
        const userId = req.user._id  //mongoDB id
        const clerkId = req.user.clerkId  // Get clerkId from user object

        if (!difficulty || !problem) {
            return res.status(400).json({ message: "Problem and difficulty are required" })
        }
        // generate a unique call id for stream video  or uuid
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Convert difficulty to lowercase for enum validation
        const normalizedDifficulty = difficulty.toLowerCase();

        // gereting session in database
        const session = await Session.create({ problem, difficulty: normalizedDifficulty, host: userId, callId })

        //creating a video call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: { problem, difficulty, sessionId: session.id.toString() },
            },
        });

        //chat messaging
        const channel = chatClient.channel("messaging", callId, {
            name: `${problem}Session`,
            created_by_id: clerkId,
            members: [clerkId]
        });

        await channel.create();

        res.status(201).json({ session });

    } catch (error) {
        console.log("Error in createSession controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

//===> Find active sessions for two way communication
export async function getActiveSessions(_, res) {
    try {
        // Only show sessions that are active AND don't have a participant yet (not full)
        const sessions = await Session.find({ 
            status: "active",
            participant: null  // Only show sessions that aren't full
        })
            .populate("host", "name profileImage email clerkId")
            .populate("participant", "name profileImage email clerkId")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ sessions });

    } catch (error) {
        console.log("Error in getActiveSessions controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

//====> Find recent session hosted or attended
export async function getMyRecentSessions(req, res) {
    try {
        const userId = req.user._id;

        const sessions = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }],
        }).sort({ createdAt: -1 }).limit(20);

        res.status(200).json({ sessions });
    } catch (error) {
        console.log("Error in getMyRecentSession controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

//===> Find the by using Id
export async function getSessionById(req, res) {
    try {
        const { id } = req.params
        const session = await Session.findById(id)
            .populate("host", "name email profileImage clerkId")
            .populate("participant", "name email profileImage clerkId")

        if (!session) return res.status(404).json({ message: "Session not found" })

        res.status(200).json({ session })

    } catch (error) {
        console.log("Error in getSessionById controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

//====> Joining the session 
export async function joinSession(req, res) {
    try {
        const { id } = req.params
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.status !== "active") {
            return res.status(400).json({ message: "Cannot join a completed session" });
        }
        if (session.host.toString() === userId.toString()) {
            return res.status(400).json({ message: "Host cannot join their own session as participant" });
        }

        if (session.participant) return res.status(400).json({ message: "Session is full. Only 1 participant allowed." })

        session.participant = userId
        await session.save()

        const channel = chatClient.channel("messaging", session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({ session })
    } catch (error) {
        console.log("Error in joinSession controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

// Ending the session 
export async function endSession(req, res) {
    try {
        const { id } = req.params
        const userId = req.user._id

        const session = await Session.findById(id)

        if (!session) return res.status(409).json({ message: "Session not found" })

        // check the host only can end the call

        if (session.host.toString() != userId.toString()) {
            return res.status(403).json({ message: "Only host can en this session" });
        }

        // checking if session is already completed

        if (session.status === "completed") {
            return res.status(400).json({ message: "Session is already completed." });
        }

        session.status = "completed";
        await session.save();

        // Deleting the video call for the session
        const call = streamClient.video.call("default", session.callId)
        await call.delete({ hard: true })

        // deleting chat channel
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();

        res.status(200).json({ session, message: "Session ended successfully" });

    } catch (error) {
        console.log("Error in endSession controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}

// Update session problem
export async function updateSessionProblem(req, res) {
    try {
        const { id } = req.params;
        const { problem, difficulty } = req.body;
        const userId = req.user._id;

        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: "Session not found" });

        // Only host can change the problem
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only host can change the problem" });
        }

        // Can only change problem in active sessions
        if (session.status !== "active") {
            return res.status(400).json({ message: "Cannot change problem in a completed session" });
        }

        session.problem = problem;
        if (difficulty) {
            session.difficulty = difficulty.toLowerCase();
        }
        await session.save();

        const updatedSession = await Session.findById(id)
            .populate("host", "name email profileImage clerkId")
            .populate("participant", "name email profileImage clerkId");

        res.status(200).json({ session: updatedSession, message: "Problem updated successfully" });

    } catch (error) {
        console.log("Error in updateSessionProblem controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}