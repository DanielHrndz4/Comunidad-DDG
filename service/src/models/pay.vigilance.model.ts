import mongoose from "mongoose";

const payVigilanceSchema = new mongoose.Schema({
    numberTarget: {
        type: String,
        require: true
    },
    context: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    cvc: {
        type: Number,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
},
{
    timestamps: true
});

export default mongoose.model("Pay", payVigilanceSchema);