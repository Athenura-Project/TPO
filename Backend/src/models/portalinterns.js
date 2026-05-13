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
    tpo: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: ""
    },
    tpoIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TPO"
    }],
    branch: {
        type: String,
        default: ""
    },
    // ✅ FINAL STATUS (your updated version)
    status: {
        type: String,
        enum: ["Not Contacted", "Follow-up Required", "No Response", "Converted", "Assigned"],
        default: "Not Contacted"
    },
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
    },
    currentAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TPO",
        default: null
    }
}, { timestamps: true });


// 🔐 Hash password before saving
internsSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

// 🔑 Compare password method
internsSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};


// 🔒 Remove password in response

// remove password
internsSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// ✅ REGISTER MODEL PROPERLY
const Intern =
    mongoose.models.Intern ||
    mongoose.model("Intern", internsSchema);

export default Intern;