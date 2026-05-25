import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    visitName: {
        type: String,
        required: true
    },
    dui: {
        type: String,
        required: true
    },
    numPlaca: {
        type: String,
        require: true
    },
    visitHouse: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Visit", visitSchema);