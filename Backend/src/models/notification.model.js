import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interns",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedTPO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TPO"
    },
    type: {
        type: String,
        enum: ["info", "warning", "success", "error", "assignment"],
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
