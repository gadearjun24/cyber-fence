// routes/history.js
const express = require("express");
const auth = require("../middleware/auth");
const User = require("../model/User");
const PhishingURL = require("../model/PhishingURL");
const router = express.Router();

// GET /api/history?limit=20&page=1&prediction=safe
router.get("/", auth, async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 5);
  const filter = {};
  const userId = req.user.id; // from auth middleware
  const user = await User.findById(userId);
  console.log(user);
  if (user.role !== "admin") {
    filter.user = userId; // ensure users see only their own uploads
  }
  if (req.query.prediction) filter.verdict = req.query.prediction;

  const total = await PhishingURL.countDocuments(filter);
  const items = await PhishingURL.find(filter)
    .sort({ checkedAt: -1 })
    .skip((page - 1) * limit)
    .populate("user", "username email")
    .limit(limit)
    .lean();

  res.json({ total, page, limit, items });
});

// POST /api/history/reanalyze/:id  (optional)
router.post("/reanalyze/:id", async (req, res) => {
  // re-analysis could fetch record, re-run models, update db, and emit event
  const upload = await PhishingURL.findById(req.params.id);
  if (!upload) return res.status(404).json({ error: "Not found" });

  // Placeholder response for now
  res.json({ success: true, message: "Reanalysis endpoint placeholder" });
});

module.exports = router;
