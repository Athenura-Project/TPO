import nodemailer from "nodemailer";

export const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,       // ✅ Change from 587 to 465
      secure: true,    // ✅ Change from false to true
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"TPO Admin" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("✅ Mail Sent Successfully! ID:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Mail Error Details:");
    console.error(err.message);
    throw err;
  }
};