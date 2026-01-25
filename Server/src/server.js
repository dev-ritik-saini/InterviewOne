import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express"
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import sessionRoutes from "./routes/sessionRoutes.js"
const app = express();

//Handling cors policy - MUST be before other middleware and routes
const allowedOrigins = [
    ENV.CLIENT_URL,
    "https://interviewone.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

//middlewares 
app.use(express.json());
app.use(clerkMiddleware()); // this add auth to field to request object :req.auth()

//inngest integration 
app.use("/api/inngest", serve({ client: inngest, functions }));

//Health check endpoints
app.get("/health", (req, res) => { res.status(200).json({ msg: "Server is sending api response." }) });
app.get("/", (req, res) => { res.status(200).json({ msg: "Server is running and sending api response." }) });
//Chat routes 
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);



// Server starting script
const startServer = async () => {
    try {
        if (!ENV.DB_URL) {
            throw new Error("Database URI is not defined.");
        }
        await connectDB();
        const PORT = ENV.PORT || 5000;
        app.listen(PORT, () =>
            console.log("Server running is on port:", PORT))
    } catch (error) {
        console.log("Error starting server:", error);
    }
}
startServer();
