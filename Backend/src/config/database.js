import mongoose from 'mongoose'
import config from './env.js';

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Database Connected Successfuly ✅")
    } catch (error) {
        console.error("Connection fail ❌", error.message)
        process.exit(1)
    }
}
export default connectDB;