import mongoose, { Mongoose } from "mongoose";

const internsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    branch: String,
    status: {
        type: String,
        enum: ["Active", "Pending", "Placed"],
        default: "Active",
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "intern"],
        default: 'intern'
    },

}, { timestamps: true })

export default mongoose.model("interns" ,internsSchema)
