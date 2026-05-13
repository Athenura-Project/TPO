import mongoose from "mongoose";

const bulkImportJobSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interns",
        required: [true, "Admin ID is required"]
    },
    fileName: {
        type: String,
        required: [true, "File name is required"]
    },
    importedType: {
        type: String,
        enum: ["interns", "tpos"],
        required: [true, "Import type must be specified"]
    },
    status: {
        type: String,
        enum: ["processing", "completed", "failed"],
        default: "processing"
    },
    totalRecords: {
        type: Number,
        default: 0
    },
    successfulRecords: {
        type: Number,
        default: 0
    },
    failedRecords: {
        type: Number,
        default: 0
    },
    errors: [
        {
            rowNumber: Number,
            field: String,
            error: String
        }
    ],
    completedAt: {
        type: Date
    }
}, { timestamps: true });

// Indexes
bulkImportJobSchema.index({ adminId: 1, createdAt: -1 });
bulkImportJobSchema.index({ status: 1 });

export default mongoose.model("BulkImportJob", bulkImportJobSchema);
