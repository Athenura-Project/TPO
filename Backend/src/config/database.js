import mongoose from "mongoose";
import config from "./env.js";



const connectDB = async () => {
  try {
    const { setDefaultResultOrder, setServers } = await import("dns");
    setDefaultResultOrder("ipv4first");
    setServers(["8.8.8.8", "8.8.4.4"]);

    // const mongoose = (await import("mongoose")).default;
    await mongoose.connect(config.MONGO_URI);

    console.log("CONNECTED DB:", mongoose.connection.name);
    console.log("CONNECTED HOST:", mongoose.connection.host);
    
    console.log("Mongo URI loaded:", config.MONGO_URI ? "YES" : "NO");
    console.log("Mongo URI:", process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Connection fail ❌", error);
    process.exit(1);
  }
};

export default connectDB;