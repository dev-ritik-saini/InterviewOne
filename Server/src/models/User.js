import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    clerkId: {
        type: String,
        require: true,
        unique: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;