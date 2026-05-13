import axios from "axios";
import { otpTemplate } from "../utils/emailTemplate.js";

export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Athenura TPO",
          email: process.env.SENDER_EMAIL 
        },
        to: [{ email }],
        subject: "OTP Verification",
        htmlContent: otpTemplate(otp),

        replyTo: {
          email: process.env.SENDER_EMAIL
        }
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ EMAIL SENT:", {
      messageId: response.data.messageId,
      email
    });

    console.log("BREVO RESPONSE FULL:", JSON.stringify(response.data, null, 2));
    
    return response.data;

  } catch (error) {
    console.log("❌ Email error:", error.response?.data || error.message);
    throw error;
  }
};