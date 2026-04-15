import config from "./env.js";

const connectDB = async () => {
  try {
    const { setDefaultResultOrder, setServers } = await import("dns");
    setDefaultResultOrder("ipv4first");
    setServers(["8.8.8.8", "8.8.4.4"]);

    const mongoose = (await import("mongoose")).default;
    await mongoose.connect(config.MONGO_URI);

    console.log("MONGO_URL =", process.env.MONGO_URL);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Connection fail ❌", error);
    process.exit(1);
  }
};

export default connectDB;