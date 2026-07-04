import mongoose from "mongoose";
import "dotenv/config";
import Task2 from "./models/task2.model.js";

async function run() {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.error("MONGO_URL not found in env");
    process.exit(1);
  }
  await mongoose.connect(url);
  console.log("Connected to MongoDB!");
  const tasks = await Task2.find();
  console.log("Tasks count:", tasks.length);
  for (const t of tasks) {
     console.log(`Task ID: ${t._id}, title: ${t.title2}, hasLocation: ${!!t.location}, location: ${JSON.stringify(t.location)}`);
  }
  await mongoose.connection.close();
}

run().catch(console.error);
