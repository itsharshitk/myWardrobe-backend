import mongoose from "mongoose";

async function connectDB(uri) {
    try{
        await mongoose.connect(uri);
        console.log("Database Connected");
    } catch(err){
        console.error("Database Connection Failed: ", err.message);
        process.exit(1);
    }
}

export default connectDB;