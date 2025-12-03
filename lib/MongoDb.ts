// lib/db.ts
import mongoose from "mongoose";

let isConnected = false;
const uri = process.env.MONGODB_URI;

export async function connectDB() {
  if (isConnected) return;

  if (!uri) throw new Error("MONGO_URI is not defined");
  try {
    await mongoose.connect(uri, {
      dbName: "test",
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error :", error);
    throw new Error("MongoDB connection failed :");
  }
}
