import mongoose, { Mongoose } from "mongoose";

const internsSchema = new mongoose.Schema({
    _id: ObjectId,
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