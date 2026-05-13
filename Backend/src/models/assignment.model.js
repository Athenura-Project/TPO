import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intern",
        required: [true, "Intern ID is required"],
    },
    tpoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TPO",
        required: [true, "TPO ID is required"],
       
    },
  
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intern" ,// Admin who made the assignment (admins are in Intern collection)
        required: [true, "Assigned by admin ID is required"],
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

// prevent duplicate assignment (recommended)

// ✅ IMPORTANT: prevents duplicate SAME intern + SAME TPO
assignmentSchema.index({ internId: 1, tpoId: 1 }, { unique: true });
assignmentSchema.index({ assignedDate: -1 });

  
  export default mongoose.model("Assignment", assignmentSchema);