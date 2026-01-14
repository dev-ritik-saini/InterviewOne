import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "InterviewOne" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await connectDB();
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`,
            profileImage: image_url
        }
        // Sending data to mongoDB
        await User.create(newUser);

        // Registering with stream api user

        await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage,
        });

        // TODO: Send a welcome Email after registration.
    }
);


const deleteUser = inngest.createFunction(
    { id: "delete-user" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();
        const { id } = event.data;
        // Deleting from MongoDB
        await User.deleteOne({ clerkId: id });

        // Deleting user from stream api 
        await deleteStreamUser(id.toString());

    }
);

export const functions = [syncUser, deleteUser];