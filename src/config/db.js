import mongoose from "mongoose";
import logger from "./logger.js";

async function connectDB(uri) {
    try{
        await mongoose.connect(uri);

        logger.info("Database Connected");
    } catch(err){
        logger.error("Database Connection Failed: ", err.message);

        process.exit(1);
    }
}

export default connectDB;