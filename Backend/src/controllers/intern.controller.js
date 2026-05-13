
import Intern from "../models/portalinterns.js";
import Notification from "../models/notification.model.js";
import Performance from "../models/performance.model.js";
import Assignment from "../models/assignment.model.js";

import TPO from "../models/tpo.model.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const normalizeStatus = (status) => {
    const map = {
        "Follow-up": "Follow-up Required",
        "Follow Up": "Follow-up Required",
        "NoResponse": "No Response",
        "No Response": "No Response",
        "Converted": "Converted",
        "Assigned": "Assigned",
        "Not Contacted": "Not Contacted"
    };

    return map[status?.trim()] || status;
};


// ✅ Get TPOs assigned to current intern
export const getMyTPOs = async (req, res) => {
    try {
        const { status, sortBy = "-createdAt" } = req.query;
        const filter = {
            assignedInterns: {
               $in: [req.user._id]
            }
         };

        if (status) {
            filter.status = status;
        }

        const tpos = await TPO.find(filter)
        .populate("assignedInterns","name email")
        .populate("interactions.internId", "name")
            .sort(sortBy);

        res.json({ success: true, count: tpos.length, tpos });
    } catch (error) {
        console.error("Error fetching TPOs:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching TPOs",
        });
    }
};

// ✅ Get single TPO details
export const getTPOById = async (req, res) => {
    try {
        const tpo = await TPO.findOne({
            _id: req.params.id,
            assignedInterns: {
               $in: [req.user._id]
            }
         }).populate([
            { path: "assignedInterns", select: "name email" },
            { path: "createdBy", select: "name email" },
            { path: "interactions.internId", select: "name" }
          ])

        if (!tpo) {
            return res.status(404).json({
                success: false,
                message: "TPO not found or you do not have access",
            });
        }

        res.json({ success: true, tpo });
    } catch (error) {
        console.error("Error fetching TPO:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching TPO details",
        });
    }
};

// ✅ Create TPO (intern adds new TPO)
export const createTPO = async (req, res) => {
    try {
        const {
            instituteName,
            contactPerson,
            contactMethod,
            email,
            phone,
            notes
          } = req.body;

        if (!instituteName) {
            return res.status(400).json({
                success: false,
                message: "Institute name is required",
            });
        }

        const tpo = await TPO.create({
            instituteName,
            contactPerson,   // ✅ ADD THIS PROPERLY
            contactMethod: contactMethod || "Email",
            email: email || "",
            phone: phone || "",
            notes: notes || "",
            createdBy: req.user._id,
            assignedInterns: [req.user._id],
            assignedAt: new Date(),
            status: "Not Contacted"
          });

        // Create assignment record
        const existingAssignment = await Assignment.findOne({
            internId: req.user._id,
            tpoId: tpo._id
        });
        
        if (!existingAssignment) {
            await Assignment.create({
                internId: req.user._id,
                tpoId: tpo._id,
                assignedBy: req.user._id,
                assignedDate: new Date()
            });
        }

        
        await Intern.findByIdAndUpdate(req.user._id, {
            $addToSet: { tpoIds: tpo._id },
            $set: { status: "Assigned" }
        });

        // Update performance metrics
        await updatePerformanceMetrics(req.user._id);

        res.status(201).json({
            success: true,
            message: "TPO added successfully",
            tpo
        });
    } catch (error) {
        console.error("Error creating TPO:", error);
      
        res.status(500).json({
          success: false,
          message: error.message, // 🔥 show real error
        });
      }
};

// ✅ Update TPO (status, follow-up date, notes)
export const updateTPO = async (req, res) => {
    try {
        const { status, followUpDate, notes, contactMethod } = req.body;

        const tpo = await TPO.findOne({
            _id: req.params.id,
            $or: [
              { createdBy: req.user._id },
              { assignedInterns: { $in: [req.user._id] } }
            ]
          });

        if (!tpo) {
            return res.status(404).json({
                success: false,
                message: "TPO not found or you do not have access",
            });
        }

        // ✅ SAFE STATUS UPDATE
        if (status) {
            const cleanStatus = normalizeStatus(status);

            if (!TPO.schema.path("status").enumValues.includes(cleanStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value",
                    received: status
                });
            }

            tpo.status = cleanStatus;
        }

        if (followUpDate) {
            tpo.followUpDate = new Date(followUpDate); // 🔥 FIX
          }
      
        if (notes !== undefined && notes.trim() !== "") {
            // Push new interaction
            tpo.interactions.push({
                internId: req.user._id,
                studentId: req.user.studentId || "N/A",
                internName: req.user.name || "N/A",
                note: notes,
                contactMethod: contactMethod || tpo.contactMethod || "Email",
                date: new Date()
            });
            
            // Also update the main notes field for backward compatibility or quick view
            tpo.notes = notes; 
        }
        
        tpo.updatedAt = new Date();
        await tpo.save();

        // ✅ safe performance update (prevent crash)
        if (status === "Converted") {
          try {
            await updatePerformanceMetrics(req.user._id);
          } catch (err) {
            console.error("Performance update failed:", err);
          }
        }

        res.json({
            success: true,
            message: "TPO updated successfully",
            tpo
        });
    } catch (error) {
        console.error("Error updating TPO:", error);
        return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
    }
};

// ✅ Delete TPO
export const deleteTPO = async (req, res) => {
    try {
        const tpo = await TPO.findOne({
            _id: req.params.id,
            $or: [
              { createdBy: req.user._id },
              { assignedInterns: req.user._id }
            ]
          });

        if (!tpo) {
            return res.status(404).json({
                success: false,
                message: "TPO not found or you do not have permission to delete it",
            });
        }

        await TPO.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: "TPO deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting TPO:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting TPO",
        });
    }
};

// ✅ Get personal performance metrics
export const getPerformance = async (req, res) => {
    try {
        let performance = await Performance.findOne({ internId: req.user._id });

        if (!performance) {
            performance = new Performance({ internId: req.user._id });
            await performance.save();
        }

        // Calculate live metrics
        const assignedTpos = await TPO.countDocuments({ assignedInterns: req.user._id });
        const convertedTpos = await TPO.countDocuments({
            assignedInterns: {
                $in: [req.user._id]
             },
            status: "Converted"
        });
        const contactedTpos = await TPO.countDocuments({
            assignedInterns: req.user._id,
            status: { $ne: "Not Contacted" }
        });
        const recentActivity = await TPO.countDocuments({
            assignedInterns: req.user._id,
            updatedAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        });

        const conversionRate = assignedTpos > 0 
            ? ((convertedTpos / assignedTpos) * 100).toFixed(2) 
            : 0;

        res.json({
            success: true,
            data: {
                ...performance.toObject(),
                assignedCount: assignedTpos,
                convertedCount: convertedTpos,
                contactedCount: contactedTpos,
                conversionRate,
                activityLevel: recentActivity
            }
        });
    } catch (error) {
        console.error("Error fetching performance:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching performance metrics",
        });
    }
};

// ✅ Get notifications
export const getNotifications = async (req, res) => {
    try {
        const { unread = false } = req.query;
        const filter = { recipientId: req.user._id };

        if (unread === "true") {
            filter.read = false;
        }

        const notifications = await Notification.find(filter)
            .sort("-createdAt")
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            recipientId: req.user._id,
            read: false
        });

        res.json({
            success: true,
            unreadCount,
            notifications
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications",
        });
    }
};

// ✅ Mark notification as read
export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipientId: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        notification.read = true;
        await notification.save();

        res.json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        console.error("Error marking notification:", error);
        res.status(500).json({
            success: false,
            message: "Error marking notification",
        });
    }
};

// ✅ Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipientId: req.user._id, read: false },
            { read: true }
        );

        res.json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Error marking notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error marking notifications",
        });
    }
};

// Helper function to update performance metrics
async function updatePerformanceMetrics(internId) {
    try {
        const assignedCount = await TPO.countDocuments({ assignedInterns: { $in: [internId] } });
        const contactedCount = await TPO.countDocuments({
            assignedInterns: { $in: [internId] }    ,
            status: { $ne: "Not Contacted" }
        });
        const convertedCount = await TPO.countDocuments({
            assignedInterns: {
                $in: [internId]
             },
            status: "Converted"
        });
        const followUpCompletionCount = await TPO.countDocuments({
            assignedInterns: {
                $in: [internId]
             },
            status: "Converted",
            followUpDate: { $exists: true }
        });

        let performance = await Performance.findOne({ internId });
        if (!performance) {
            performance = new Performance({ internId });
        }

        performance.assignedCount = assignedCount;
        performance.contactedCount = contactedCount;
        performance.convertedCount = convertedCount;
        performance.followUpCompletionCount = followUpCompletionCount;
        performance.lastUpdated = new Date();

        await performance.save();
    } catch (error) {
        console.error("Error updating performance metrics:", error);
    }
}



// ✅ Send email to single TPO
export const sendTPOEmail = async (req, res) => {
    try {
        const { tpoId, subject, message } = req.body;

        // Find TPO
        const tpo = await TPO.findOne({
            _id: tpoId,
            assignedInterns: { $in: [req.user._id] }
        });

        if (!tpo) {
            return res.status(404).json({
                success: false,
                message: "TPO not found or you don't have access"
            });
        }

        if (!tpo.email) {
            return res.status(400).json({
                success: false,
                message: "TPO does not have an email address"
            });
        }

        // Get PDF attachments
        const attachments = [];
        const pdfFiles = ['brochure.pdf', 'placement-policy.pdf']; // Your PDF file names
        
        for (const pdfFile of pdfFiles) {
            const pdfPath = path.join(__dirname, '../uploads', pdfFile);
            if (fs.existsSync(pdfPath)) {
                const pdfContent = fs.readFileSync(pdfPath);
                attachments.push({
                    name: pdfFile,
                    content: pdfContent.toString('base64'),
                    type: 'application/pdf'
                });
            }
        }

        // Send email via Brevo
        const emailResponse = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: req.user.name || "Intern",
                    email: process.env.SENDER_EMAIL
                },
                to: [{ email: tpo.email, name: tpo.tpoName || tpo.instituteName }],
                subject: subject || `TPO Collaboration Opportunity - ${tpo.instituteName}`,
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #224D59;">Dear ${tpo.tpoName || 'TPO'},</h2>
                        <p>${message || `We are excited to connect with ${tpo.instituteName} for potential collaboration opportunities.`}</p>
                        <br/>
                        <p>Best regards,<br/>${req.user.name}<br/>Intern at Athenura</p>
                        <hr style="border: 1px solid #B8CC34;"/>
                        <p style="font-size: 12px; color: #666;">This is an automated message from Athenura TPO Management System.</p>
                    </div>
                `,
                attachment: attachments
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        // Record email interaction
        tpo.interactions.push({
            internId: req.user._id,
            studentId: req.user.studentId,
            internName: req.user.name,
            note: `Email sent: ${subject}`,
            contactMethod: "Email",
            date: new Date()
        });
        
        tpo.lastEmailSent = new Date();
        await tpo.save();

        // Create notification for intern
        await Notification.create({
            recipientId: req.user._id,
            title: "Email Sent",
            message: `Email sent successfully to ${tpo.instituteName}`,
            type: "announcement",
            read: false
        });

        res.json({
            success: true,
            message: `Email sent successfully to ${tpo.instituteName}`,
            data: emailResponse.data
        });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || "Failed to send email"
        });
    }
};

// ✅ Bulk send emails to multiple TPOs
export const bulkSendTPOEmails = async (req, res) => {
    try {
        const { tpoIds, subject, message } = req.body;

        if (!tpoIds || !Array.isArray(tpoIds) || tpoIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one TPO"
            });
        }

        // Find all selected TPOs assigned to this intern
        const tpos = await TPO.find({
            _id: { $in: tpoIds },
            assignedInterns: { $in: [req.user._id] }
        });

        if (tpos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No valid TPOs found"
            });
        }

        // Filter TPOs with email
        const tposWithEmail = tpos.filter(tpo => tpo.email);
        const tposWithoutEmail = tpos.filter(tpo => !tpo.email);

        if (tposWithEmail.length === 0) {
            return res.status(400).json({
                success: false,
                message: "None of the selected TPOs have email addresses"
            });
        }

        // Get PDF attachments
        const attachments = [];
        const pdfFiles = ['brochure.pdf', 'placement-policy.pdf'];
        
        for (const pdfFile of pdfFiles) {
            const pdfPath = path.join(__dirname, '../uploads', pdfFile);
            if (fs.existsSync(pdfPath)) {
                const pdfContent = fs.readFileSync(pdfPath);
                attachments.push({
                    name: pdfFile,
                    content: pdfContent.toString('base64'),
                    type: 'application/pdf'
                });
            }
        }

        let successCount = 0;
        let failedCount = 0;
        const results = [];

        // Send emails to each TPO
        for (const tpo of tposWithEmail) {
            try {
                const emailResponse = await axios.post(
                    "https://api.brevo.com/v3/smtp/email",
                    {
                        sender: {
                            name: req.user.name || "Intern",
                            email: process.env.SENDER_EMAIL
                        },
                        to: [{ email: tpo.email, name: tpo.tpoName || tpo.instituteName }],
                        subject: subject || `TPO Collaboration Opportunity - ${tpo.instituteName}`,
                        htmlContent: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #224D59;">Dear ${tpo.tpoName || 'TPO'},</h2>
                                <p>${message || `We are excited to connect with ${tpo.instituteName} for potential collaboration opportunities.`}</p>
                                <br/>
                                <p>Best regards,<br/>${req.user.name}<br/>Intern at Athenura</p>
                                <hr style="border: 1px solid #B8CC34;"/>
                                <p style="font-size: 12px; color: #666;">This is an automated message from Athenura TPO Management System.</p>
                            </div>
                        `,
                        attachment: attachments
                    },
                    {
                        headers: {
                            "api-key": process.env.BREVO_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Record email interaction
                tpo.interactions.push({
                    internId: req.user._id,
                    studentId: req.user.studentId,
                    internName: req.user.name,
                    note: `Bulk email sent: ${subject}`,
                    contactMethod: "Email",
                    date: new Date()
                });
                
                tpo.lastEmailSent = new Date();
                await tpo.save();

                successCount++;
                results.push({
                    tpoId: tpo._id,
                    instituteName: tpo.instituteName,
                    email: tpo.email,
                    status: "success"
                });

            } catch (error) {
                failedCount++;
                results.push({
                    tpoId: tpo._id,
                    instituteName: tpo.instituteName,
                    email: tpo.email,
                    status: "failed",
                    error: error.response?.data?.message || error.message
                });
                console.error(`Failed to send email to ${tpo.email}:`, error.message);
            }
        }

        // Create notification for intern
        await Notification.create({
            recipientId: req.user._id,
            title: "Bulk Email Sent",
            message: `Sent ${successCount} email(s) successfully. Failed: ${failedCount}`,
            type: "announcement",
            read: false
        });

        res.json({
            success: true,
            message: `Emails sent: ${successCount} successful, ${failedCount} failed`,
            data: {
                total: tposWithEmail.length,
                successCount,
                failedCount,
                tposWithoutEmail: tposWithoutEmail.map(t => ({
                    id: t._id,
                    instituteName: t.instituteName,
                    reason: "No email address"
                })),
                results
            }
        });

    } catch (error) {
        console.error("Error in bulk email:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to send bulk emails"
        });
    }
};

// ✅ Get email status for TPOs (to disable button if already emailed)
export const getTPOEmailStatus = async (req, res) => {
    try {
        const tpos = await TPO.find({
            assignedInterns: { $in: [req.user._id] }
        }).select("_id instituteName email lastEmailSent");

        const emailStatus = tpos.map(tpo => ({
            id: tpo._id,
            instituteName: tpo.instituteName,
            email: tpo.email,
            hasEmail: !!tpo.email,
            lastEmailSent: tpo.lastEmailSent,
            canSendEmail: !!tpo.email && (!tpo.lastEmailSent || 
                new Date() - new Date(tpo.lastEmailSent) > 24 * 60 * 60 * 1000) // Can send after 24 hours
        }));

        res.json({
            success: true,
            data: emailStatus
        });

    } catch (error) {
        console.error("Error fetching email status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch email status"
        });
    }
};