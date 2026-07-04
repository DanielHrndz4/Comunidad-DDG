import mongoose from "mongoose";
import "dotenv/config";
import Task from "./models/task.model.js";

async function run() {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.error("MONGO_URL not found in env");
    process.exit(1);
  }
  
  await mongoose.connect(url);
  console.log("Connected!");

  const startOne = Date.now();
  const taskOne = await Task.findOne().lean();
  console.log(`findOne took ${Date.now() - startOne}ms`);

  const startTwo = Date.now();
  const tasksTwo = await Task.find().limit(2).lean();
  console.log(`find(2) took ${Date.now() - startTwo}ms`);

  const startFour = Date.now();
  const tasksFour = await Task.find().limit(4).lean();
  console.log(`find(4) took ${Date.now() - startFour}ms`);

  await mongoose.connection.close();
}

run().catch(console.error);
