import internsModels from "../models/internsadmin.models.js";
import TPO from "../models/tpo.model.js";
import bcrypt from "bcrypt";
import XLSX from "xlsx";
import Performance from "../models/performance.model.js";
import Notification from "../models/notification.model.js";
import Assignment from "../models/assignment.model.js";
import BulkImportJob from "../models/bulkimport.model.js";
import mongoose from "mongoose";

import fs from "fs";
//  Get all interns




export const getInterns = async (req, res) => {
    try {
      const interns = await internsModels
        .find({ role: "intern" })
        .populate("tpoIds")
        .lean();
  
      const updatedInterns = interns.map((intern) => {
        const tpoNames = (intern.tpoIds || [])
          .map(tpo => tpo.instituteName)
          .filter(Boolean);

        return {
          ...intern,
          tpo: tpoNames.length > 0 ? tpoNames.join(", ") : "-",
          status: tpoNames.length > 0 ? "Assigned" : intern.status,
        };
      });
  
      res.json({ success: true, interns: updatedInterns });
  
    } catch (error) {
      console.error("getInterns error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch interns" });
    }
  };

// ✅ Get single intern
export const getInternById = async (req, res) => {
    try {
        const intern = await internsModels.findById(req.params.id);

        if (!intern) {
            return res.status(404).json({
                success: false,
                message: "Intern not found",
            });
        }

        res.json({ success: true, intern });
    } catch (error) {
        console.error("Error fetching intern:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching intern",
        });
    }
};

// ✅ Create intern
export const createIntern = async (req, res) => {
    try {
        const { name, email, password, phone, role, branch, status, studentId } = req.body;

        console.log("CREATE INTERN BODY:", req.body);

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const existing = await internsModels.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const savedIntern = await internsModels.create({
            name,
            studentId: studentId || "",
            email,
            password,
            phone: phone || "",
            branch: branch || "",
            // status: status || "Active",
            status: status || "Not Contacted",
            role: role || "intern"
        });

        const intern = savedIntern.toObject();
        delete intern.password;

        return res.status(201).json({
            success: true,
            message: "Intern created successfully",
            intern
        });

    } catch (error) {
        console.error("Error creating intern:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error creating intern",
        });
    }
};

// ✅ Update intern
export const updateIntern = async (req, res) => {
    try {
        const { name, email, phone, role, status, studentId } = req.body;

        let intern = await internsModels.findById(req.params.id);
        if (!intern) {
            return res.status(404).json({
                success: false,
                message: "Intern not found",
            });
        }

        if (name) intern.name = name;
        if (studentId) intern.studentId = studentId;
        if (phone) intern.phone = phone;
        if (role) intern.role = role;
        if (status) intern.status = status; // ✅ FIX ADDED


        if (email && email !== intern.email) {
            const existingEmail = await internsModels.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use",
                });
            }
            intern.email = email;
        }

        await intern.save();

        res.json({
            success: true,
            message: "Intern updated successfully",
            intern
        });
    } catch (error) {
        console.error("Error updating intern:", error);
        res.status(500).json({
            success: false,
            message: "Error updating intern",
        });
    }
};

// ✅ Delete intern
export const deleteIntern = async (req, res) => {
    try {
        const intern = await internsModels.findByIdAndDelete(req.params.id);

        if (!intern) {
            return res.status(404).json({
                success: false,
                message: "Intern not found",
            });
        }

        // Clean up related data
        await Performance.deleteOne({ internId: intern._id });
        await TPO.deleteMany({ assignedTo: intern._id });
        await Assignment.deleteMany({ internId: intern._id });

        res.json({
            success: true,
            message: "Intern deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting intern:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting intern",
        });
    }
};
// ------------------------------------------------

// ✅ Get all TPOs
export const getTPOs = async (req, res) => {
    try {
        const { status, assignedTo, page = 1, limit = 20, search } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (search) {
            filter.$or = [
                { instituteName: { $regex: search, $options: "i" } },
                { tpoName: { $regex: search, $options: "i" } }
            ];
        }

        const limitNum = Number(limit) || 20;        
        const total = await TPO.countDocuments(filter);
        const tpos = await TPO.find(filter)
        // .populate("assignedInterns", "name email")
        // .populate("createdBy", "name email")
        .skip(skip)
        .limit(parseInt(limit))
        .sort("-createdAt");

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            tpos
        });
    } catch (error) {
        console.error("Error fetching TPOs:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching TPOs",
        });
    }
};

// ✅ Update TPO and reassign
export const updateTPOAdmin = async (req, res) => {
    try {
        const { status, assignedTo, followUpDate, notes } = req.body;

        let tpo = await TPO.findById(req.params.id);
        if (!tpo) {
            return res.status(404).json({
                success: false,
                message: "TPO not found",
            });
        }

        const previousAssignee = tpo.assignedTo;

        if (status) tpo.status = status;
        if (notes) tpo.notes = notes;
        if (followUpDate) tpo.followUpDate = followUpDate;

        if (
            assignedTo &&
            (!tpo.assignedTo || assignedTo !== tpo.assignedTo.toString())
        ){
            tpo.assignedTo = assignedTo;
            tpo.assignedAt = new Date();

            // Create assignment record
            await Assignment.updateOne(
                { internId, tpoId },
                {
                    $setOnInsert: {
                        internId,
                        tpoId,
                        assignedBy: req.user?._id || null,
                        assignedDate: new Date()
                    }
                },
                { upsert: true }
            );

            // Create notification
            await Notification.create({
                recipientId: assignedTo,
                title: "New TPO Assignment",
                message: `You have been assigned a new TPO: ${tpo.instituteName}`,
                type: "assignment",
                relatedTPOId: tpo._id
            });

            // Update metrics for both
            await updatePerformanceMetrics(previousAssignee);
            await updatePerformanceMetrics(assignedTo);
        }

        await tpo.save();

        res.json({
            success: true,
            message: "TPO updated successfully",
            tpo
        });
    } catch (error) {
        console.error("Error updating TPO:", error);
        res.status(500).json({
            success: false,
            message: "Error updating TPO",
        });
    }
};


// export const assignAdminTPO = async (req, res) => {
//     try {
//       const { tpoId, internIds } = req.body;
  
//       // ✅ Validate TPO ID
//       if (!tpoId || !mongoose.Types.ObjectId.isValid(tpoId)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid TPO ID",
//         });
//       }
  
//       // ✅ Validate Intern IDs
//       if (!Array.isArray(internIds) || internIds.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Intern IDs are required",
//         });
//       }
  
//       // ✅ Find TPO
//       const tpo = await TPO.findById(tpoId);
  
//       if (!tpo) {
//         return res.status(404).json({
//           success: false,
//           message: "TPO not found",
//         });
//       }
  
//       // ✅ Find valid interns
//       const validInterns = await internsModels.find({
//         _id: { $in: internIds },
//       });
  


//       let createdAssignments = 0;

//       for (const intern of validInterns) {
//         // prevent duplicate assignment
//         const exists = await Assignment.findOne({
//           internId: intern._id,
//           tpoId,
//         });
  
//         if (exists) continue;
//         // -----------------------------------------
//         // UPDATE INTERN
//         // -----------------------------------------
//         await internsModels.findByIdAndUpdate(intern._id, {
//           tpoId,
//           status: "Assigned",
//         });
  
//         // -----------------------------------------
//         // CREATE ASSIGNMENT
//         // -----------------------------------------
//         await Assignment.create({
//             internId: intern._id,
//           tpoId,
//           assignedBy: req.user?._id || null,
//           assignedDate: new Date(),
//         });
  
//         createdAssignments++;
  
//         // -----------------------------------------
//         // UPDATE PERFORMANCE
//         // -----------------------------------------
//         await updatePerformanceMetrics(intern._id);
  
//         // -----------------------------------------
//         // CREATE NOTIFICATION
//         // -----------------------------------------
//         await Notification.create({
//             recipientId: intern._id,
//           title: "TPO Assignment",
//           message: `You have been assigned to ${tpo.instituteName}`,
//           type: "info",
//           relatedTPOId: tpoId,
//         });
//       }
  
//       // ✅ UPDATE TPO ASSIGNED INTERNS
//       tpo.assignedInterns = [
//         ...new Set([
//           ...(tpo.assignedInterns || []),
//           ...validInternIds,
//         ]),
//       ];
  
//       // ✅ UPDATE TOTAL STUDENT COUNT
//       const totalAssignments = await Assignment.countDocuments({
//         tpoId,
//       });
  
//       tpo.studentsRegistered = totalAssignments;
  
//       tpo.assignedAt = new Date();
  
//       await tpo.save();
  
//       // ✅ SUCCESS RESPONSE
//       return res.status(200).json({
//         success: true,
//         message: "Interns assigned successfully",
//         assigned: createdAssignments,
//         totalStudents: totalAssignments,
//         tpo,
//       });
  
//     } catch (error) {
//       console.error("Error assigning TPO:", error);
  
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Error assigning TPO",
//       });
//     }
//   };

// export const assignAdminTPO = async (req, res) => {
//     try {
//       const { tpoId, internIds } = req.body;
  
//       if (!mongoose.Types.ObjectId.isValid(tpoId)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid TPO ID",
//         });
//       }
  
//       if (!Array.isArray(internIds) || internIds.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Intern IDs are required",
//         });
//       }
  
//       const tpo = await TPO.findById(tpoId);
//       if (!tpo) {
//         return res.status(404).json({
//           success: false,
//           message: "TPO not found",
//         });
//       }
  

//       const interns = await internsModels.find({ _id: { $in: internIds } });


//       const validInterns = await internsModels.find({
//         _id: { $in: internIds },
//       });
  
//       let createdAssignments = 0;
  
//       for (const intern of validInterns) {
//         // prevent duplicate assignment
//         const exists = await Assignment.findOne({
//           internId: intern._id,
//           tpoId,
//         });
  
//         if (exists) continue;
  
//         // update intern
//         await internsModels.findByIdAndUpdate(intern._id, {
//           tpoId,
//           status: "Assigned",
//         });
  
//         // create assignment
//         await Assignment.create({
//           internId: intern._id,
//           tpoId,
//           assignedBy: req.user?._id || null,
//           assignedDate: new Date(),
//         });
  
//         // notification
//         await Notification.create({
//           recipientId: intern._id,
//           title: "TPO Assignment",
//           message: `You have been assigned to ${tpo.instituteName}`,
//           type: "info",
//           relatedTPOId: tpoId,
//         });
  
//         // performance update
//         await updatePerformanceMetrics(intern._id);
  
//         createdAssignments++;
//       }
  
//       // update TPO count
//       const totalAssignments = await Assignment.countDocuments({ tpoId });
  
//       tpo.studentsRegistered = totalAssignments;
//       tpo.assignedAt = new Date();
//       tpo.assignedInterns = [
//         ...new Set([
//           ...(tpo.assignedInterns || []),
//           ...validInterns.map(i => i._id),
//         ]),
//       ];
  
//       await tpo.save();
  
//       return res.json({
//         success: true,
//         message: "Interns assigned successfully",
//         assigned: createdAssignments,
//         totalStudents: totalAssignments,
//       });
  
//     } catch (error) {
//       console.error("assignAdminTPO error:", error);
  
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };


export const assignAdminTPO = async (req, res) => {
    try {
      const { tpoId, internIds } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(tpoId)) {
        return res.status(400).json({ success: false, message: "Invalid TPO ID" });
      }
  
      if (!Array.isArray(internIds) || internIds.length === 0) {
        return res.status(400).json({ success: false, message: "Intern IDs required" });
      }
  
      const targetTpoId = new mongoose.Types.ObjectId(tpoId);
      const tpo = await TPO.findById(targetTpoId);
      if (!tpo) {
        return res.status(404).json({ success: false, message: "TPO not found" });
      }
  
      const interns = await internsModels.find({ _id: { $in: internIds } });
      if (interns.length === 0) {
        return res.status(404).json({ success: false, message: "No valid interns found" });
      }
  
      // 1. Update interns in bulk
      await internsModels.updateMany(
        { _id: { $in: interns.map(i => i._id) } },
        { 
          $addToSet: { tpoIds: targetTpoId },
          $set: { status: "Assigned" } 
        }
      );
  
      // 2. Bulk assignment (SAFE + NO DUPLICATES)
      const ops = interns.map(intern => ({
        updateOne: {
          filter: { internId: intern._id, tpoId: targetTpoId },
          update: {
            $setOnInsert: {
              internId: intern._id,
              tpoId: targetTpoId,
              assignedBy: req.user?._id,
              assignedDate: new Date(),
            },
          },
          upsert: true,
        },
      }));
  
      const result = await Assignment.bulkWrite(ops);
  
      // 3. Notifications
      await Notification.insertMany(
        interns.map(intern => ({
          recipientId: intern._id,
          message: `You have been assigned to ${tpo.instituteName}`,
          type: "info",
          relatedTPO: targetTpoId,
        }))
      );
  
      // 4. Update TPO
      const totalAssignments = await Assignment.countDocuments({ tpoId: targetTpoId });
  
      tpo.studentsRegistered = totalAssignments;
      tpo.assignedAt = new Date();
      
      // Use string comparison for deduplication
      const existingIds = (tpo.assignedInterns || []).map(id => id.toString());
      const newIds = interns.map(i => i._id.toString());
      const uniqueIds = [...new Set([...existingIds, ...newIds])];
      
      tpo.assignedInterns = uniqueIds.map(id => new mongoose.Types.ObjectId(id));
  
      await tpo.save();
  
      return res.json({
        success: true,
        message: "Interns assigned successfully",
        assigned: result.upsertedCount || 0,
        totalStudents: totalAssignments,
      });
  
    } catch (error) {
      console.error("assignAdminTPO error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };






export const getAnalytics = async (req, res) => {
    try {
        const [
            totalInterns,
            totalTPOs,
            convertedTPOs,
            internsByBranch,
            tposTimeline,
            topRecruitersRaw
        ] = await Promise.all([
            internsModels.countDocuments({ role: "intern" }),
            TPO.countDocuments(),
            TPO.countDocuments({ status: "Converted" }),
            // Branch Stats
            internsModels.aggregate([
                { $match: { role: "intern", branch: { $ne: "" } } },
                {
                    $group: {
                        _id: "$branch",
                        total: { $sum: 1 },
                        placed: {
                            $sum: { $cond: [{ $eq: ["$status", "Placed"] }, 1, 0] }
                        }
                    }
                }
            ]),
            // Timeline Stats (All time, grouped by month)
            TPO.aggregate([
                {
                    $project: {
                        month: { 
                            $month: { $ifNull: ["$createdAt", new Date()] }
                        },
                        status: 1
                    }
                },
                {
                    $group: {
                        _id: { month: "$month" },
                        added: { $sum: 1 },
                        converted: {
                            $sum: { $cond: [{ $eq: ["$status", "Converted"] }, 1, 0] }
                        }
                    }
                },
                { $sort: { "_id.month": 1 } }
            ]),

            // Top Recruiters (Institutes with converted TPOs)
            TPO.aggregate([
                { $match: { status: "Converted" } },
                {
                    $group: {
                        _id: "$instituteName",
                        hires: { $sum: 1 }
                    }
                },
                { $sort: { hires: -1 } },
                { $limit: 5 }
            ])
        ]);

        const conversionRate =
            totalTPOs > 0 ? Number(((convertedTPOs / totalTPOs) * 100).toFixed(1)) : 0;

        // Process branch stats
        const branchStats = internsByBranch.map(b => ({
            name: b._id,
            total: b.total,
            placed: b.placed,
            percentage: b.total > 0 ? Math.round((b.placed / b.total) * 100) : 0
        }));

        // Process top recruiters
        const topRecruiters = topRecruitersRaw.map(r => ({
            company: r._id,
            hires: r.hires,
            avgPackage: "N/A" // Package info not available in DB
        }));

        // Process timeline data (ensure all 12 months are present)
        const timelineData = {
            added: new Array(12).fill(0),
            converted: new Array(12).fill(0)
        };

        // Align with standard Jan-Dec (1-12 from MongoDB)
        tposTimeline.forEach(t => {
            const monthIdx = t._id.month - 1;
            if (monthIdx >= 0 && monthIdx < 12) {
                timelineData.added[monthIdx] = t.added || 0;
                timelineData.converted[monthIdx] = t.converted || 0;
            }
        });



        res.json({
            success: true,
            totalInterns,
            totalTPOs,
            convertedTPOs,
            conversionRate,
            branchStats,
            timelineData,
            topRecruiters
        });
    } catch (error) {
        console.error("getAnalytics error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
};


// ✅ Get specific intern analytics
export const getInternAnalytics = async (req, res) => {
    try {
        const intern = await internsModels.findById(req.params.id);
        if (!intern) {
            return res.status(404).json({
                success: false,
                message: "Intern not found",
            });
        }

        let performance = await Performance.findOne({ internId: req.params.id });
        if (!performance) {
            performance = new Performance({ internId: req.params.id });
            await performance.save();
        }


        const assignments = await Assignment.find({
            internId: req.params.id
         }).populate("tpoId");
         
         const assignedTPOs = assignments
            .map(a => a.tpoId)
            .filter(Boolean);


        if (intern.tpoIds && intern.tpoIds.length > 0) {
            const assignedTPOsList = await TPO.find({ _id: { $in: intern.tpoIds } });
            intern.tpo = assignedTPOsList.map(t => t.instituteName).join(", ");
            intern.tpoStatus = "Assigned";
            intern.status = "Assigned";
        } else {
            intern.tpo = "-";
            intern.tpoStatus = "Not Assigned";
        }


        const statusBreakdown = {
            converted: assignedTPOs.filter(t => t.status === "Converted").length,
            followUpRequired: assignedTPOs.filter(t => t.status === "Follow-up Required").length,
            noResponse: assignedTPOs.filter(t => t.status === "No Response").length,
            notContacted: assignedTPOs.filter(t => t.status === "Not Contacted").length
        };

        const recentActivity = assignedTPOs
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 10);

        res.json({
            success: true,
            data: {
                intern,
                performance: performance.toObject(),
                statusBreakdown,
                recentActivity
            }
        });
    } catch (error) {
        console.error("Error fetching intern analytics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching intern analytics",
        });
    }
};

// Dashboard summary for admin panel
export const getAdminDashboardSummary = async (req, res) => {
    try {
        const [
            totalInterns,
            totalTPOs,
            convertedTPOs,
            recentInterns,
            recentTPOs
        ] = await Promise.all([
            internsModels.countDocuments({ role: "intern" }),
            TPO.countDocuments(),
            TPO.countDocuments({ status: "Converted" }),

            internsModels
                .find({ role: "intern" })
                .sort({ _id: -1 })
                .limit(5)
                .select("name email createdAt"),

            TPO.find()
                .sort({ _id: -1 })
                .limit(5)
                .select("companyName status assignedTo createdAt")
        ]);

        const conversionRate =
            totalTPOs > 0
                ? Number(((convertedTPOs / totalTPOs) * 100).toFixed(1))
                : 0;

        let statusBreakdownAgg = [];

        try {
            statusBreakdownAgg = await TPO.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);
        } catch (err) {
            console.log("Aggregation error:", err);
        }

        const statusBreakdown = statusBreakdownAgg.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        // Weekly Performance (Current Week: Sun to Sat)
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        // Set to Sunday of the current week
        const diff = today.getDate() - today.getDay(); 
        firstDayOfWeek.setDate(diff);
        firstDayOfWeek.setHours(0, 0, 0, 0);

        const weeklyStatsRaw = await TPO.aggregate([
            {
                $match: {
                    createdAt: { $gte: firstDayOfWeek }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                    },
                    added: { $sum: 1 },
                    converted: {
                        $sum: { $cond: [{ $eq: ["$status", "Converted"] }, 1, 0] }
                    }
                }
            }
        ]);

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklyData = {
            labels: days,
            added: new Array(7).fill(0),
            converted: new Array(7).fill(0)
        };

        for (let i = 0; i < 7; i++) {
            const d = new Date(firstDayOfWeek);
            d.setDate(firstDayOfWeek.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            
            const match = weeklyStatsRaw.find(s => s._id.date === dateStr);
            if (match) {
                weeklyData.added[i] = match.added;
                weeklyData.converted[i] = match.converted;
            }
        }


        return res.json({
            success: true,
            overview: {
                totalInterns,
                totalTPOs,
                convertedTPOs,
                conversionRate
            },
            statusBreakdown,
            recentInterns,
            recentTPOs,
            weeklyData
        });


    } catch (error) {
        console.error("getAdminDashboardSummary error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard summary"
        });
    }
};


// Bulk import TPOs
export const bulkImport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Normalize keys robustly so CSV headers like "Full Name", "full_name",
        // "FULL-NAME", or BOM-prefixed values map to the same alias.
        const normalize = (value = "") =>
            String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const getCellValue = (row, aliases = []) => {
            const keys = Object.keys(row || {});
            for (const alias of aliases) {
                const matchedKey = keys.find((k) => normalize(k) === normalize(alias));
                if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
                    const value = typeof row[matchedKey] === "string" ? row[matchedKey].trim() : row[matchedKey];
                    if (value !== "") return value;
                }
            }
            return null;
        };

        const importTypeInput = String(req.body?.importType || "").toLowerCase().trim();
        const importType = ["interns", "institutes", "tpos"].includes(importTypeInput)
            ? importTypeInput
            : "institutes";

        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        let inserted = 0;
        let skipped = 0;
        let failed = 0;

        for (const row of data) {
            try {
                if (importType === "interns") {
                    const name = getCellValue(row, ["name", "fullName", "studentName", "internName"]);
                    const emailRaw = getCellValue(row, ["email", "emailAddress", "mail"]);
                    const email = emailRaw ? String(emailRaw).toLowerCase() : null;

                    if (!name || !email) {
                        skipped++;
                        continue;
                    }

                    const existingIntern = await internsModels.findOne({ email });
                    if (existingIntern) {
                        skipped++;
                        continue;
                    }

                    const passwordText =
                        String(getCellValue(row, ["password", "tempPassword", "temporaryPassword"]) || "Temp@123");
                    const hashedPassword = await bcrypt.hash(passwordText, 10);

                    const rawStatus = String(getCellValue(row, ["status"]) || "Active");
                    const allowedInternStatuses = new Set(["Active", "Pending", "Placed"]);
                    const status = allowedInternStatuses.has(rawStatus) ? rawStatus : "Active";
                   

                    await internsModels.create({
                        name: String(name),
                        studentId: String(getCellValue(row, ["id", "studentId", "aithId", "rollNumber"]) || ""),
                        email,
                        phone: getCellValue(row, ["phone", "mobile", "phoneNumber"]) || "",
                        branch: getCellValue(row, ["branch", "department", "course"]) || "",
                        status,
                        password: hashedPassword,
                        role: "intern",
                    });
                    inserted++;
                } else {
                    const companyName = getCellValue(row, ["companyName", "instituteName", "company", "name"]);
                    if (!companyName) {
                        skipped++;
                        continue;
                    }

                    const existingTpo = email
                        ? await TPO.findOne({ instituteName: String(companyName), email: String(email) })
                        : await TPO.findOne({ instituteName: String(companyName) });

                    if (existingTpo) {
                        skipped++;
                        continue;
                    }

                    await TPO.create({
                        instituteName: String(companyName),
                        contactPerson: getCellValue(row, ["contactPerson", "tpoName", "contactName"]) || "",
                        email: email ? String(email) : "",
                        phone: getCellValue(row, ["phone", "contactNumber", "mobile"]) || "",
                    });

                    inserted++;
                }
            } catch (err) {
                console.error("Error inserting row:", err);
                failed++;
            }
        }

        res.json({ success: true, importType, inserted, skipped, failed });
    } catch (error) {
        console.error("bulkImport error:", error);
        res.status(500).json({ success: false, message: "Failed to process bulk import" });
    }
};




export const getAllTPOs = async (req, res) => {
    try {
      const tpos = await TPO.find()
        .populate("interactions.internId", "name")
        .sort({ createdAt: -1 });
  
      const formattedTpos = await Promise.all(
        tpos.map(async (tpo) => {
  
          // 🔥 REAL DATA FROM INTERN COLLECTION
          const assignedInterns = await internsModels.find({
            tpoIds: { $in: [new mongoose.Types.ObjectId(tpo._id)] }
          }).select("name studentId email");

          const studentsRegistered = assignedInterns.length;

          return {
            _id: tpo._id,
            id: tpo._id,
  
            instituteName: tpo.instituteName || "N/A",
            tpoName: tpo.tpoName || "N/A",
            email: tpo.email || "N/A",
            phone: tpo.phone || "",
            status: tpo.status || "New",
  
            studentsRegistered,   // ✅ ALWAYS ACCURATE
            assignedInterns,      // ✅ NEW: List of assigned students
            interactions: tpo.interactions || [], // ✅ NEW: Interaction history
            lastActive: tpo.updatedAt || "Just now"
          };
        })
      );
      res.json({
        success: true,
        tpos: formattedTpos,
      });
  
    } catch (error) {
      console.error("getAllTPOs error:", error);
  
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const createAdminTPO = async (req, res) => {
    try {
      const tpoData = {
        instituteName: req.body.instituteName,
        tpoName: req.body.tpoName || "",
        email: req.body.email || "",
        phone: req.body.phone || "",
        status: req.body.status || "Not Contacted",
        contactMethod: req.body.contactMethod || "",
        notes: req.body.notes || "",
        createdBy: req.user?._id || null
      };

  
      const tpo = await TPO.create(tpoData);
  
      const studentsRegistered = await internsModels.countDocuments({
        tpoId: tpo._id
      });

      res.status(201).json({
        success: true,
        tpo: {
          id: tpo._id,
          instituteName: tpo.instituteName,
          tpoName: tpo.tpoName,
          email: tpo.email,
          status: tpo.status,
        //   studentsRegistered: tpo.assignedInterns?.length || 0,  // ✅ FIX
        studentsRegistered,
          lastActive: "Just now"
        }
      });
  
    } catch (error) {
      console.error("createAdminTPO error:", error);
  
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };



export const updateAdminTPO = async (req, res) => {
    try {
        const { status, assignedTo, followUpDate, notes } = req.body;

        let tpo = await TPO.findById(req.params.id);
        if (!tpo) {
            return res.status(404).json({
                success: false,
                message: "TPO not found",
            });
        }

        const previousAssignee = tpo.assignedTo;

        if (status) tpo.status = status;
        if (notes) tpo.notes = notes;
        if (followUpDate) tpo.followUpDate = followUpDate;

        if (
            assignedTo &&
            (!tpo.assignedTo || assignedTo !== tpo.assignedTo.toString())
        ) {
            tpo.assignedTo = assignedTo;
            tpo.assignedAt = new Date();

            // Create assignment record
            await Assignment.updateOne(
                { internId: assignedTo, tpoId: tpo._id },
                {
                  $setOnInsert: {
                    internId: assignedTo,
                    tpoId: tpo._id,
                    assignedBy: req.user?._id || null,
                    assignedDate: new Date()
                  }
                },
                { upsert: true }
              );

            // Create notification
            await Notification.create({
                recipientId: assignedTo,
                title: "New TPO Assignment",
                // ✅ FIXED: Using instituteName instead of collegeName
                message: `You have been assigned a new TPO: ${tpo.instituteName}`,
                type: "assignment",
                relatedId: tpo._id
            });
        }

        tpo.updatedAt = new Date();
        await tpo.save();

        res.json({
            success: true,
            message: "TPO updated successfully",
            tpo
        });
    } catch (error) {
        console.error("Error updating TPO:", error);
        res.status(500).json({
            success: false,
            message: "Error updating TPO",
        });
    }
};

export const deleteAdminTPO = async (req, res) => {
    try {
        await TPO.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "TPO deleted successfully" });
    } catch (error) {
        console.error("deleteAdminTPO error:", error);
        res.status(500).json({ success: false, message: "Failed to delete TPO" });
    }
};

export const unassignAdminTPO = async (req, res) => {
    try {
      const { internId, tpoId } = req.body;
  
      if (!internId || !tpoId) {
        return res.status(400).json({ success: false, message: "Intern ID and TPO ID required" });
      }
  
      // 1. Remove TPO from Intern's list
      await internsModels.findByIdAndUpdate(internId, {
        $pull: { tpoIds: tpoId }
      });
  
      // 2. Delete Assignment record
      await Assignment.findOneAndDelete({ internId, tpoId });
  
      // 3. Update Intern status if no more TPOs
      const intern = await internsModels.findById(internId);
      if (intern && (!intern.tpoIds || intern.tpoIds.length === 0)) {
        intern.status = "Active";
        await intern.save();
      }
  
      // 4. Update TPO student count
      const totalAssignments = await Assignment.countDocuments({ tpoId });
      await TPO.findByIdAndUpdate(tpoId, { studentsRegistered: totalAssignments });
  
      res.json({ success: true, message: "Intern unassigned successfully" });
    } catch (error) {
      console.error("unassignAdminTPO error:", error);
      res.status(500).json({ success: false, message: "Server error during unassignment" });
    }
  };

// ✅ Send broadcast notification
export const broadcastNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required",
            });
        }

        const allInterns = await internsModels.find({ role: "intern" }, "_id");

        const notifications = allInterns.map(intern => ({
            recipientId: intern._id,
            title,
            message,
            type: "announcement",
            read: false,
            createdAt: new Date()
        }));

        await Notification.insertMany(notifications);

        res.json({
            success: true,
            message: "Broadcast sent to all interns",
            recipientCount: allInterns.length
        });
    } catch (error) {
        console.error("Error sending broadcast:", error);
        res.status(500).json({
            success: false,
            message: "Error sending broadcast notification",
        });
    }
};

// Helper function
// async function updatePerformanceMetrics(internId) {
//     try {
//         const assignedCount = await TPO.countDocuments({ assignedInterns: internId });
//         const contactedCount = await TPO.countDocuments({
//             assignedInterns: internId,
//             status: { $ne: "Not Contacted" }
//         });
//         const convertedCount = await TPO.countDocuments({
//             assignedInterns: internId,
//             status: "Converted"
//         });

//         let performance = await Performance.findOne({ internId });
//         if (!performance) {
//             performance = new Performance({ internId });
//         }

//         performance.assignedCount = assignedCount;
//         performance.contactedCount = contactedCount;
//         performance.convertedCount = convertedCount;
//         performance.lastUpdated = new Date();

//         await performance.save();
//     } catch (error) {
//         console.error("Error updating performance:", error);
//     }
// }


async function updatePerformanceMetrics(internId) {
    try {
      const assignedCount = await Assignment.countDocuments({ internId });
  
      const tpos = await Assignment.find({ internId }).populate("tpoId");
  
      const contactedCount = tpos.filter(
        (t) => t.tpoId?.status !== "Not Contacted"
      ).length;
  
      const convertedCount = tpos.filter(
        (t) => t.tpoId?.status === "Converted"
      ).length;
  
      let performance = await Performance.findOne({ internId });
  
      if (!performance) {
        performance = new Performance({ internId });
      }
  
      performance.assignedCount = assignedCount;
      performance.contactedCount = contactedCount;
      performance.convertedCount = convertedCount;
      performance.lastUpdated = new Date();
  
      await performance.save();
    } catch (error) {
      console.error("Error updating performance:", error);
    }
  }

// ✅ Bulk assign multiple TPOs to a single intern
export const bulkAssignTPOsToIntern = async (req, res) => {
    try {
        const { internId, tpoIds } = req.body;

        console.log(req.body)
        // Validate Intern ID
        if (!mongoose.Types.ObjectId.isValid(internId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Intern ID" 
            });
        }

        // Validate TPO IDs
        if (!Array.isArray(tpoIds) || tpoIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "At least one TPO ID is required" 
            });
        }

        // Check if intern exists
        const intern = await internsModels.findById(internId);
        if (!intern) {
            return res.status(404).json({ 
                success: false, 
                message: "Intern not found" 
            });
        }

        // Validate all TPO IDs
        const validTPOs = await TPO.find({ 
            _id: { $in: tpoIds } 
        });

        if (validTPOs.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No valid TPOs found" 
            });
        }

        const validTPOIds = validTPOs.map(tpo => tpo._id);
        let assignedCount = 0;
        let skippedCount = 0;

        // Process each TPO
        for (const tpo of validTPOs) {
            // Check if assignment already exists
            const existingAssignment = await Assignment.findOne({
                internId: intern._id,
                tpoId: tpo._id
            });

            if (existingAssignment) {
                skippedCount++;
                continue;
            }

            // Create assignment record
            await Assignment.create({
                internId: intern._id,
                tpoId: tpo._id,
                assignedBy: req.user?._id || null,
                assignedDate: new Date()
            });

            // Add TPO to intern's tpoIds array (if not already there)
            if (!intern.tpoIds.includes(tpo._id)) {
                await internsModels.findByIdAndUpdate(intern._id, {
                    $addToSet: { tpoIds: tpo._id }
                });
            }

            // Add intern to TPO's assignedInterns array
            if (!tpo.assignedInterns || !tpo.assignedInterns.includes(intern._id)) {
                await TPO.findByIdAndUpdate(tpo._id, {
                    $addToSet: { assignedInterns: intern._id }
                });
            }

            // Update TPO student count
            const totalAssignments = await Assignment.countDocuments({ tpoId: tpo._id });
            await TPO.findByIdAndUpdate(tpo._id, { 
                studentsRegistered: totalAssignments 
            });

            // Create notification for intern
            await Notification.create({
                recipientId: intern._id,
                title: "New TPO Assignment",
                message: `You have been assigned to ${tpo.instituteName}`,
                type: "assignment",
                relatedTPO: tpo._id
            });

            assignedCount++;
        }

        // Update intern status if they have assignments
        if (assignedCount > 0) {
            await internsModels.findByIdAndUpdate(internId, {
                status: "Assigned"
            });
        }

        // Update performance metrics
        await updatePerformanceMetrics(internId);

        res.json({
            success: true,
            message: `${assignedCount} TPO(s) assigned successfully${skippedCount > 0 ? ` (${skippedCount} already assigned)` : ''}`,
            data: {
                assignedCount,
                skippedCount,
                intern: {
                    id: intern._id,
                    name: intern.name,
                    email: intern.email
                },
                assignedTPOs: validTPOs.map(tpo => ({
                    id: tpo._id,
                    instituteName: tpo.instituteName
                }))
            }
        });

    } catch (error) {
        console.error("bulkAssignTPOsToIntern error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to assign TPOs to intern"
        });
    }
};

// ✅ Get unassigned TPOs for a specific intern
export const getUnassignedTPOsForIntern = async (req, res) => {
    try {
        const { internId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(internId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Intern ID" 
            });
        }

        // Get all TPOs
        const allTPOs = await TPO.find().select("_id instituteName tpoName email status");

        // Get already assigned TPO IDs for this intern
        const assignments = await Assignment.find({ 
            internId: internId 
        }).select("tpoId");

        const assignedTPOIds = assignments.map(a => a.tpoId.toString());

        // Filter unassigned TPOs
        const unassignedTPOs = allTPOs.filter(tpo => 
            !assignedTPOIds.includes(tpo._id.toString())
        );

        res.json({
            success: true,
            internId,
            totalTPOs: allTPOs.length,
            assignedCount: assignedTPOIds.length,
            unassignedCount: unassignedTPOs.length,
            unassignedTPOs
        });

    } catch (error) {
        console.error("getUnassignedTPOsForIntern error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};