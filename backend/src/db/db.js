import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed !", error);
    // throw error;
  }
};
