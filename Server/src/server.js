import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express"
import { inngest, functions } from "./lib/inngest.js"
const app = express();

//middlewares 
app.use(express.json());

//Handling cors policy
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}
));
//inngest integration 
app.use("/api/inngest", serve({ client: inngest, functions }))

app.get("/api/health", (req, res) => { res.status(200).json({ msg: "Server is sending api response." }) });

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
