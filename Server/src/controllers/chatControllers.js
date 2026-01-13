import { chatClient } from "../lib/stream.js";


export async function getStreamToken(req, res) {
    try {
        // using clerk ID  for stream
        const token = chatClient.createToken(req.user.clerkId);

        res.status(200).json({
            token,
            userId: res.user.clerkId,
            userName: res.user.name,
            userImage: res.user.image,
        })
    } catch (error) {
        console.error("Internal server error.", error);
        res.status(500).json({ message: "Internal server error  " })

    }
}