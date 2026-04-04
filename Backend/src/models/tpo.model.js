import mongoose from "mongoose";

const tpoSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contactPerson: String,
    email: String,
    phone: String,

    status: {
        type: String,
        enum: ["New", "Contacted", "Follow-up Required", "Converted"],
        default: "New"
    },

    followUpDate: Date,

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interns"
    },

    notes: String

}, { timestamps: true });

export default mongoose.model("TPO", tpoSchema);