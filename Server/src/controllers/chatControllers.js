import { chatClient } from "../lib/stream.js";
import { streamClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        // using clerk ID for stream
        const userId = req.user.clerkId;
        
        // Create token for chat
        const chatToken = chatClient.createToken(userId);
        
        // Create token for video calls
        const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiry
        const iat = Math.floor(Date.now() / 1000) - 10;
        const videoToken = streamClient.generateUserToken({ user_id: userId, exp, iat });

        res.status(200).json({
            token: chatToken,
            videoToken,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.profileImage,
        });
    } catch (error) {
        console.error("Internal server error.", error);
        res.status(500).json({ message: "Internal server error" });
    }
}