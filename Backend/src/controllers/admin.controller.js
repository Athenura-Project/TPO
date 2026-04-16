import internsModels from "../models/interns.models.js";
import TPO from "../models/tpo.model.js";
import bcrypt from "bcrypt";

//  Get all interns
export const getInterns = async (req, res) => {
    try {
        const interns = await internsModels.find({ role: "intern" });
        res.json({ success: true, interns });
    } catch (error) {
        console.error("getInterns error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch interns" });
    }
};

//  Assign TPO to intern
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
        const convertedTPOs = await TPO.countDocuments({ status: "Converted" });
        const conversionRate =
            totalTPOs > 0 ? Number(((convertedTPOs / totalTPOs) * 100).toFixed(1)) : 0;

        res.json({
            success: true,
            totalInterns,
            totalTPOs,
            convertedTPOs,
            conversionRate,
        });
    } catch (error) {
        console.error("getAnalytics error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
};

// Dashboard summary for admin panel
export const getAdminDashboardSummary = async (req, res) => {
    try {
        const [totalInterns, totalTPOs, convertedTPOs, recentInterns, recentTPOs] =
            await Promise.all([
                internsModels.countDocuments({ role: "intern" }),
                TPO.countDocuments(),
                TPO.countDocuments({ status: "Converted" }),
                internsModels
                    .find({ role: "intern" })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select("name email createdAt"),
                TPO.find()
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select("companyName status assignedTo createdAt")
                    .populate("assignedTo", "name email"),
            ]);

        const conversionRate =
            totalTPOs > 0 ? Number(((convertedTPOs / totalTPOs) * 100).toFixed(1)) : 0;

        const statusBreakdownAgg = await TPO.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const statusBreakdown = statusBreakdownAgg.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.json({
            success: true,
            overview: {
                totalInterns,
                totalTPOs,
                convertedTPOs,
                conversionRate,
            },
            statusBreakdown,
            recentInterns,
            recentTPOs,
        });
    } catch (error) {
        console.error("getAdminDashboardSummary error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard summary",
        });
    }
};

// Create intern from admin panel
export const createIntern = async (req, res) => {
    try {
        const { name, email, password, phone, branch, status } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "name, email and password are required",
            });
        }

        const existing = await internsModels.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Intern with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const intern = await internsModels.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "intern",
            branch,
            status,
        });

        res.status(201).json({
            success: true,
            message: "Intern created successfully",
            intern,
        });
    } catch (error) {
        console.error("createIntern error:", error);
        res.status(500).json({ success: false, message: "Failed to create intern" });
    }
};
