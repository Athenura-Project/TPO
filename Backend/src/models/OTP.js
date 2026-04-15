import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;   // ✅ VERY IMPORTANT