import TPO from "../models/tpo.model.js";
import Notification from "../models/notification.model.js";

export const getMyTPOs = async (req, res) => {
    const tpos = await TPO.find({ assignedTo: req.user._id });
    res.json({ success: true, tpos });
};

export const createTPO = async (req, res) => {
    const tpo = await TPO.create({
        ...req.body,
        assignedTo: req.user._id
    });

    res.json({ success: true, tpo });
};

export const updateTPO = async (req, res) => {
    const tpo = await TPO.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json({ success: true, tpo });
};

export const getPerformance = async (req, res) => {
    const total = await TPO.countDocuments({ assignedTo: req.user._id });

    const converted = await TPO.countDocuments({
        assignedTo: req.user._id,
        status: "Converted"
    });

    res.json({ success: true, total, converted });
};

export const getNotifications = async (req, res) => {
    const notifications = await Notification.find({
        recipientId: req.user._id
    });

    res.json({ success: true, notifications });
};

export const markNotificationRead = async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, {
        isRead: true
    });

    res.json({ success: true });
};