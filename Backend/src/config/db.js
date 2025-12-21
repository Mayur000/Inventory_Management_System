import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async ()=>{

    const uri= process.env.MONGO_URI;

    try {
        await mongoose.connect(uri);
        console.log("Connected to Db ");
    } catch (error) {
        console.error(error);
        console.log("Failed to create connection");
    }

};

export default connectDB;