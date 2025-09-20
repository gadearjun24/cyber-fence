// routes/phishing.js
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const PhishingURL = require("../model/PhishingURL");
const { checkPhishing } = require("../cyberFence");
const auth = require("../middleware/auth");

// POST /api/detect/url
// Body: { urls: ["https://example.com", "http://phishing.com"] }
router.post("/url", auth, async (req, res) => {
  const io = req.app.get("io");
  const userSocketMap = req.app.get("userSocketMap");
  const userId = req.user.id;

  const { urls } = req.body;
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "No URLs provided" });
  }

  try {
    // Run phishing check
    const results = await checkPhishing(urls); // assume this returns an array of objects or probabilities
    // Example: [{ url: "...", probability: 0.9984 }, ...]

    const finalResults = [];
    console.log(results);
    const user = await User.findById(userId);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      const probability = results[i].probability; // number between 0 and 1
      // Determine verdict
      let verdict;
      if (probability >= 0.9) verdict = "Phishing";
      else if (probability >= 0.5) verdict = "Suspicious";
      else verdict = "Safe";

      // Save to DB
      const doc = await PhishingURL.create({
        url,
        results: results[i], // raw model output
        verdict,
        confidence: +(probability * 100).toFixed(2),
        user: userId,
      });

      // Prepare response
      finalResults.push({
        id: doc._id,
        url: doc.url,
        results: doc.results,
        verdict: doc.verdict,
        confidence: doc.confidence,
        user: userId,
        checkedAt: doc.checkedAt,
      });
    }

    // Update user stats
    user.uploadsCount += urls.length;
    await user.save();

    // Emit via socket.io to specific user
    const socketId = userSocketMap[userId];
    if (socketId) {
      io.to(socketId).emit("phishing_check_complete", {
        newResults: finalResults,
        uploadsCount: urls.length,
        totalUploads: user.uploadsCount,
      });
    }
    res.json({
      success: true,
      results: finalResults,
    });
  } catch (err) {
    console.error("Phishing detection error:", err);
    res.status(500).json({ error: "Processing failed" });
  }
});

module.exports = router;
