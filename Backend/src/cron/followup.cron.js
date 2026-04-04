import cron from "node-cron";
import TPO from "../models/tpo.model.js";
import Notification from "../models/notification.model.js";
import helmet from "helmet";
import cors from "cors";


app.use(helmet());
app.use(cors());

cron.schedule("0 8 * * *", async () => {
    const today = new Date();

    const tpos = await TPO.find({
        followUpDate: { $lte: today },
        status: "Follow-up Required"
    }).populate("assignedTo");

    for (const tpo of tpos) {
        await Notification.create({
            recipientId: tpo.assignedTo._id,
            title: "Follow-up Reminder",
            message: `Follow up with ${tpo.companyName}`,
        });
    }
});