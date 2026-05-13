import cron from "node-cron";
import TPO from "../models/o.js";
import Notification from "../models/notification.model.js";

// Schedule follow-up reminder job to run daily at 8:00 AM
export const startFollowUpReminder = () => {
    cron.schedule("0 8 * * *", async () => {
        try {
            console.log("🔔 Running follow-up reminder job...");

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find TPOs due for follow-up
            const tposDue = await TPO.find({
                followUpDate: { $lte: today },
                status: "Follow-up Required"
            }).populate("assignedTo");

            console.log(`📋 Found ${tposDue.length} TPOs requiring follow-up`);

            for (const tpo of tposDue) {
                if (tpo.assignedTo) {
                    // Create notification
                    await Notification.create({
                        recipientId: tpo.assignedTo._id,
                        title: "Follow-up Reminder",
                        message: `Please follow up with ${tpo.collegeName}. Follow-up due: ${tpo.followUpDate.toDateString()}`,
                        type: "followup",
                        relatedTPOId: tpo._id
                    });

                    console.log(`✅ Notification created for ${tpo.assignedTo.email}`);
                }
            }

            console.log("✓ Follow-up reminder job completed");
        } catch (error) {
            console.error("❌ Error in follow-up reminder job:", error);
        }
    });
};

// Schedule performance summary email (runs every Friday at 5:00 PM)
export const startPerformanceSummary = () => {
    cron.schedule("0 17 * * 5", async () => {
        try {
            console.log("📊 Running performance summary job...");

            const Performance = (await import("../models/performance.model.js")).default;
            
            const allPerformances = await Performance.find()
                .populate("internId", "email name");

            for (const performance of allPerformances) {
                const conversionRate = 
                    performance.assignedCount > 0
                        ? ((performance.convertedCount / performance.assignedCount) * 100).toFixed(2)
                        : 0;

                // Create summary notification
                await Notification.create({
                    recipientId: performance.internId._id,
                    title: "Weekly Performance Summary",
                    message: `This week: ${performance.assignedCount} assigned, ${performance.convertedCount} converted (${conversionRate}% rate). Great work!`,
                    type: "performance"
                });
            }

            console.log("✓ Performance summary job completed");
        } catch (error) {
            console.error("❌ Error in performance summary job:", error);
        }
    });
};

// Schedule stale TPO detection (runs daily at 10:00 AM)
export const startStaleTpoDetection = () => {
    cron.schedule("0 10 * * *", async () => {
        try {
            console.log("🔍 Running stale TPO detection job...");

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const staleTpos = await TPO.find({
                status: { $in: ["Not Contacted", "Follow-up Required"] },
                updatedAt: { $lt: thirtyDaysAgo }
            }).populate("assignedTo");

            for (const tpo of staleTpos) {
                if (tpo.assignedTo) {
                    await Notification.create({
                        recipientId: tpo.assignedTo._id,
                        title: "Stale TPO Alert",
                        message: `TPO "${tpo.collegeName}" hasn't been updated for 30 days. Please update its status.`,
                        type: "announcement",
                        relatedTPOId: tpo._id
                    });
                }
            }

            console.log(`✓ Stale TPO detection completed. Found ${staleTpos.length} stale TPOs`);
        } catch (error) {
            console.error("❌ Error in stale TPO detection job:", error);
        }
    });
};

// Initialize all cron jobs
export const initializeCronJobs = () => {
    console.log("\n⏰ Initializing scheduled cron jobs...");
    startFollowUpReminder();
    startPerformanceSummary();
    startStaleTpoDetection();
    console.log("✓ All cron jobs initialized successfully\n");
};
