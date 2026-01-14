import { StreamChat } from "stream-chat"
import { ENV } from "./env.js";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = ENV.STREAM_API_KEY;
const secretKey = ENV.STREAM_API_SECRET;

if (!apiKey || !secretKey) {
    throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing...");
}

//For video calls
export const streamClient = new StreamClient(apiKey, secretKey);

//For chat and messaging features 
export const chatClient = StreamChat.getInstance(apiKey, secretKey);

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        return userData;
    } catch (error) {
        console.error("Error upserting stream user", error);
        throw error;
    }
}
export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId);
        console.log("Stream user deleted successfully..", userId);
    } catch (error) {
        console.error("Error deleting stream user", error);
    }
}
