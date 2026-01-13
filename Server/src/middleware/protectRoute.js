import { requireAuth } from "@clerk/express";

import User from "../models/User.js";

export const protectRoute = [
    requireAuth({ signUpUrl: "/sign-up" }),
    async (req, res, next) => {
        try {
            const clerkId = req.auth.userId;

            if (!clerkId) return res.status(401).json({ message: "Error Invalid access." });

            // find user in DB by clerk ID
            const user = await User.findOne({ clerkId });
            if (!user) return res.status(404).json({ message: "User not found." });
            // attach user to req.user
            req.user = user;

            next();

        } catch (error) {
            console.error("Error in middleware protectRoute", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
]