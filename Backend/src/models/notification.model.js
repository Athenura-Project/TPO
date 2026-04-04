import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interns"
    },
    title: String,
    message: String,
    type: {
        type: String,
        enum: ["followup", "announcement"],
        default: "followup"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);