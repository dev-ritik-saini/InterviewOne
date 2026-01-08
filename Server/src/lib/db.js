import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("✅Connection succesfully..", conn.connection.host);

    } catch (error) {
        console.log("❌Error not connected", error.message);
        process.exit(1); // 0 for true, 1 for false

    }
}
