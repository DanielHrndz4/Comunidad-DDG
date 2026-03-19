import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    telephone: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    role: {
        type: String,
        enum: ["admin", "vigilant", "normal"],
        default: "normal",
        require: true
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
