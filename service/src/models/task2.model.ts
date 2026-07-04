import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitud, latitud]
      required: true,
    },
  },
  { _id: false }
);

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
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: locationSchema,
        default: undefined,
    },
}, {
    timestamps: true
});

task2Schema.index({ location: "2dsphere" });

export default mongoose.model("Task2", task2Schema);