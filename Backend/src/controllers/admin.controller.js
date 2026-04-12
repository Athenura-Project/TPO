import internsModels from "../models/interns.models.js";
import TPO from "../models/tpo.model.js";

// 🔹 Get all interns
export const getInterns = async (req, res) => {
    try {
        const interns = await internsModels.find({ role: "intern" });
        res.json({ success: true, interns });
    } catch (error) {
        console.error("getInterns error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch interns" });
    }
};

// 🔹 Assign TPO to intern
export const assignTPO = async (req, res) => {
    try {
        const { tpoId, internId } = req.body;

        if (!tpoId || !internId) {
            return res.status(400).json({ success: false, message: "tpoId and internId are required" });
        }

        const tpo = await TPO.findByIdAndUpdate(
            tpoId,
            { assignedTo: internId },
            { new: true }
        );

        if (!tpo) {
            return res.status(404).json({ success: false, message: "TPO not found" });
        }

        res.json({ success: true, tpo });
    } catch (error) {
        console.error("assignTPO error:", error);
        res.status(500).json({ success: false, message: "Failed to assign TPO" });
    }
};

// 🔹 Get analytics
export const getAnalytics = async (req, res) => {
    try {
        const totalInterns = await internsModels.countDocuments({ role: "intern" });
        const totalTPOs = await TPO.countDocuments();

        res.json({ success: true, totalInterns, totalTPOs });
    } catch (error) {
        console.error("getAnalytics error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
};