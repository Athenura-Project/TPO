import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "intern",
        required: [true, "Intern ID is required"],
        unique: true,
      
    },
    assignedCount: {
        type: Number,
        default: 0
    },
    contactedCount: {
        type: Number,
        default: 0
    },
    convertedCount: {
        type: Number,
        default: 0
    },
    followUpCompletionCount: {
        type: Number,
        default: 0
    },
  
    totalScore: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


// ✅ Virtual conversion rate
performanceSchema.virtual("conversionRate").get(function () {
  if (this.assignedCount === 0) return 0;

  return Number(
    ((this.convertedCount / this.assignedCount) * 100).toFixed(2)
  );
});


// ✅ Virtual follow-up completion
performanceSchema.virtual("followUpCompletionRate").get(function () {

  const totalPending =
    this.assignedCount - this.contactedCount;

  if (totalPending <= 0) return 100;

  return Number(
    ((this.followUpCompletionCount / totalPending) * 100).toFixed(2)
  );
});


// ✅ Include virtuals in JSON
performanceSchema.set("toJSON", {
  virtuals: true
});

performanceSchema.set("toObject", {
  virtuals: true
});


// ✅ Indexes

performanceSchema.index({ convertedCount: -1 });
performanceSchema.index({ rank: 1 });

export default mongoose.model("Performance", performanceSchema);