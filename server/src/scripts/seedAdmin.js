import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import connectDB from "../db/connectDB.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🔍 Checking for existing admin...");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("✅ Admin already exists!");
      process.exit(0);
    }

    // Create admin
    const admin = new Admin({
      email: "admin@gmail.com",
      password: "admin@gmail.com",
    });

    await admin.save();

    console.log("🎉 Admin created successfully!");
    console.log("📧 Email: admin@gmail.com");
    console.log("🔑 Password: admin@gmail.com");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
