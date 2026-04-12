import { Router } from "express";
import { auth, adminOnly } from "../middlewares/auth.middleware.js";
import multer from "multer";
import XLSX from "xlsx";
import TPO from "../models/tpo.model.js";

import {
    getInterns,
    assignTPO,
    getAnalytics
} from "../controllers/admin.controller.js";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.get("/interns", auth, adminOnly, getInterns);
router.post("/assign", auth, adminOnly, assignTPO);
router.get("/analytics/overall", auth, adminOnly, getAnalytics);


router.post(
    "/bulk-import",
    auth,
    adminOnly,
    upload.single("file"),
    async (req, res) => {
        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        let inserted = 0;

        for (const row of data) {
            try {
                await TPO.create({
                    companyName: row.companyName
                });
                inserted++;
            } catch (err) {}
        }

        res.json({ success: true, inserted });
    }
);


export default router;