import internsModels from "../models/interns.models.js";
import TPO from "../models/tpo.model.js";

export const getInterns = async (req, res) => {
    const interns = await internsModels.find({ role: "intern" });
    res.json({ success: true, interns });
};

export const assignTPO = async (req, res) => {
    const { tpoId, internId } = req.body;

    const tpo = await TPO.findByIdAndUpdate(
        tpoId,
        { assignedTo: internId },
        { new: true }
    );

    res.json({ success: true, tpo });
};

export const getAnalytics = async (req, res) => {
    const totalInterns = await internsModels.countDocuments({ role: "intern" });
    const totalTPOs = await TPO.countDocuments();

    res.json({ success: true, totalInterns, totalTPOs });
};