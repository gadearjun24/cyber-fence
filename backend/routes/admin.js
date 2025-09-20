// routes/admin.js
const express = require("express");
const auth = require("../middleware/auth");
const {
  deleteUser,
  updateUser,
  getUsers,
} = require("../controller/adminController");
const User = require("../model/User");
const PhishingURL = require("../model/PhishingURL");
const router = express.Router();

// GET users with pagination, search, filters
router.get("/users", auth, getUsers);

// PATCH user (role update, suspend/unsuspend)
router.patch("/user/:id", auth, updateUser);

// DELETE user
router.delete("/user/:id", auth, deleteUser);

router.get("/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isSuspended: false });
    const inactiveUsers = totalUsers - activeUsers;

    const totalUploads = await PhishingURL.countDocuments();
    const uploadsToday = await PhishingURL.countDocuments({
      checkedAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const uploadsThisWeek = await PhishingURL.countDocuments({
      checkedAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });

    // Combined verdict: "Phishing", "Safe", "Suspicious"

    const phishing = await PhishingURL.countDocuments({
      verdict: "Phishing",
    });
    const safe = await PhishingURL.countDocuments({
      verdict: "Safe",
    });
    const suspicious = await PhishingURL.countDocuments({
      verdict: "Suspicious",
    });

    // const systemAlerts = await PhishingURL.countDocuments({ status: "failed" });

    // Upload Trends (daily counts for last 7 days)
    const uploadTrends = await PhishingURL.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkedAt" } },
          uploads: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Detection Ratios
    const detectionRatios = [
      { name: "phishing", value: phishing },
      { name: "suspicious", value: suspicious },
      { name: "safe", value: safe, count: safe },
      {
        name: "total",
        value: phishing + safe + suspicious,
      },
    ];

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalUploads,
        uploadsToday,
        uploadsThisWeek,
        phishing,
        safe,
        suspicious,

        // systemAlerts,
      },
      uploadTrends: uploadTrends.map((u) => ({
        date: u._id,
        uploads: u.uploads,
      })),
      detectionRatios,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

module.exports = router;
