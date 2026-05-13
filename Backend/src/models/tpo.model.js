import mongoose from "mongoose";

const tpoSchema = new mongoose.Schema({
  // ✅ Core TPO Information
  instituteName: {
    type: String,
    required: [true, "Institute name is required"],
    trim: true,
    maxlength: [200, "Institute name cannot exceed 200 characters"]
  },

  // Contact Information
  tpoName: {
    type: String,
    default: "",
    trim: true
  },

  email: {
    type: String,
    lowercase: true,
    default: "",
    validate: {
      validator: function(v) {
        return !v || /^\S+@\S+\.\S+$/.test(v);
      },
      message: "Please provide a valid email"
    }
  },

  phone: {
    type: String,
    default: "",
    validate: {
      validator: function(v) {
        return !v || /^[0-9]{10}$/.test(v);
      },
      message: "Phone must be exactly 10 digits"
    }
  },

  // TPO Status & Tracking
  status: {
    type: String,
    enum: [
      "New",
      "Not Contacted",
      "Contacted",
      "Follow-up Required",
      "No Response",
      "Converted",
      "Rejected",
      "Assigned"
    ],
    default: "New"
  },
  

  contactMethod: {
    type: String,
    enum: ["Email", "Phone", "Both", ""],
    default: "Both"
  },
  currentAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TPO",
    default: null
  },

  followUpDate: {
    type: Date,
    default: null
  },

  notes: {
    type: String,
    default: "",
    maxlength: [1000, "Notes cannot exceed 1000 characters"]
  },

  // ✅ Assignment Information
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
    default: null
  },
  
  assignedInterns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern"
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
    default: null
  },

  assignedAt: {
    type: Date,
    default: Date.now
  },

 
  interactions: [{
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern"
    },
    studentId: String, // AITH ID
    internName: String, // Intern's Name
    note: String,
    contactMethod: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// ✅ Indexes
tpoSchema.index({ assignedInterns: 1, createdAt: -1 });
tpoSchema.index({ assignedInterns: 1, status: 1 });
tpoSchema.index({ createdBy: 1, createdAt: -1 });
tpoSchema.index({
  instituteName: "text",
  tpoName: "text",
  email: "text"
});

// ✅ Create Model
const TPO =
  mongoose.models.TPO ||
  mongoose.model("TPO", tpoSchema);

// ✅ Export
export default TPO;