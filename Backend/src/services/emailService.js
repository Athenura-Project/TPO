import axios from "axios";
import { otpTemplate } from "../utils/emailTemplate.js";

export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Athenura",
          email: process.env.SENDER_EMAIL,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: "OTP Verification",
        htmlContent: otpTemplate(otp), // ✅ ONLY THIS
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OTP Email Sent");
    return response.data;

  } catch (error) {
    console.log("❌ Email error:", error.response?.data || error.message);
    throw error;
  }
};