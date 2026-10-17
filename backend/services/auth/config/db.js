// connect db fuction
import mongoose from "mongoose";
export const connectdb = async () => {
    try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error)
        process.exit(1) //Exit the process with failure
    }
}