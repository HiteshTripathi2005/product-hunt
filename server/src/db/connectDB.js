import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const Url = process.env.MONGODB_URL;
    const conn = await mongoose.connect(Url);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDb;
