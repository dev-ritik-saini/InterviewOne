import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
const app = express();

app.get("/", (req, res) => { res.status(200).json({ msg: "Server is sending api response." }) });

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () =>
            console.log("Server running is on port:", ENV.PORT))
    } catch (error) {
        console.log("Error starting server:", error);
    }
}
startServer();
