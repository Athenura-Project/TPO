import express from "express";
import { auth, adminOnly } from "../middlewares/auth.middleware.js";
import multer from "multer";
import XLSX from "xlsx";
import TPO from "../models/tpo.model.js";
import path from "path";
import fs from "fs";

import {
    // Intern management
    getInterns,
    getInternById,
    createIntern,
    updateIntern,
    deleteIntern,

    
    // TPO management
    getTPOs,
    updateTPOAdmin,
    assignAdminTPO,
    getAllTPOs,
    createAdminTPO,
    updateAdminTPO,
    deleteAdminTPO,

    // Bulk import
    bulkImport,
    bulkAssignTPOsToIntern,
    getUnassignedTPOsForIntern,
    
    // Analytics
    getAnalytics,
    getInternAnalytics,

    // Dashboard
    getAdminDashboardSummary,

    // Notifications
    broadcastNotification,
    unassignAdminTPO

} from "../controllers/admin.controller.js";

// const upload = multer({ dest: "uploads/" });
const router = express.Router();

/* -------------------- MULTER SETUP -------------------- */
// Configure multer for file uploads
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if ([".csv", ".xlsx", ".xls"].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV and Excel files are allowed"));
        }
    }
});


// ✅ All routes protected with verifyToken middleware
// ==================== DASHBOARD ====================

// Admin dashboard summary (overview cards + recent data)
router.get("/dashboard/summary", auth, adminOnly, getAdminDashboardSummary);


// ==================== INTERN ROUTES ====================

// Get all interns
router.get("/interns", auth, adminOnly, getInterns);
// Get single intern
router.get("/interns/:id", auth, adminOnly, getInternById);
// Create intern
router.post("/interns", auth, adminOnly, createIntern);
// Udate intern
router.put("/interns/:id", auth, adminOnly, updateIntern);
//Delete intern
router.delete("/interns/:id", auth, adminOnly, deleteIntern);

// -------------------------------------------------------------------------------------------------------


// ==================== TPO ROUTES ====================

router.get("/tpos", auth, adminOnly, getAllTPOs);
router.post("/tpos", auth, adminOnly, createAdminTPO);
router.put("/tpos/:id", auth, adminOnly, updateAdminTPO);
router.delete("/tpos/:id", auth, adminOnly, deleteAdminTPO);

/* Assign */
router.post("/assign", auth, adminOnly, assignAdminTPO);
router.post("/unassign", auth, adminOnly, unassignAdminTPO);
// ==================== BULK IMPORT ====================

router.post(
    "/bulk-import",
    auth,
    adminOnly,
    upload.single("file"),
    bulkImport
);

// ==================== ANALYTICS ====================

// Get overall analytics
router.get("/analytics/overall", auth, adminOnly, getAnalytics);

// Get specific intern analytics
router.get("/analytics/intern/:id", auth, adminOnly, getInternAnalytics);



router.post('/assign-tpos-to-intern', auth, bulkAssignTPOsToIntern);

// Get unassigned TPOs for an intern
router.get('/intern/:internId/unassigned-tpos', auth, getUnassignedTPOsForIntern);


/* -------------------- NOTIFICATIONS -------------------- */

router.post(
  "/notifications/broadcast",
  auth,
  adminOnly,
  broadcastNotification
);



export default router; 

