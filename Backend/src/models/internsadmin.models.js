import mongoose from "mongoose";
import bcrypt from "bcrypt";

const internsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"]
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^[0-9]{10}$/.test(v);
            },
            message: "Phone must be exactly 10 digits"
        }
    },
    branch: {
        type: String,
        default: ""
    },
    // ✅ FIXED STATUS ENUM
    status: {
        type: String,
        enum: ["Active", "Pending", "Placed", "Inactive", "Assigned"],  // ✅ added "Assigned"
        default: "Active"
    },
    tpoIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TPO"
    }],
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "intern"],
        default: "intern"
    }
}, { timestamps: true });


// 🔐 Hash password before saving
internsSchema.pre("save", async function () {
    try {
        if (!this.isModified("password")) return;

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
        throw error;
    }
});

// 🔑 Compare password method
internsSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};


// 🔒 Remove password in response
internsSchema.methods.toJSON = function () {
    const intern = this.toObject();
    delete intern.password;
    return intern;
};


// ⚡ Indexes

internsSchema.index({ createdAt: -1 });


export default mongoose.model(
    "Intern",
    internsSchema,
    "interns"
  );