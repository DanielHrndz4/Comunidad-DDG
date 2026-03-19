import mongoose from "mongoose";

const task2Schema = new mongoose.Schema({
    title2: {
        type: String,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
    date2: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Task2", task2Schema);