// models/PhishingURL.js
const mongoose = require("mongoose");

const PhishingURLSchema = new mongoose.Schema({
  url: { type: String, required: true }, // The URL being checked
  results: { type: mongoose.Schema.Types.Mixed }, // Raw output from ONNX/model (e.g., probability array)
  verdict: { type: String }, // Combined verdict: "Phishing", "Safe", "Suspicious"
  confidence: { type: Number }, // Probability or confidence (0-100)
  checkedAt: { type: Date, default: Date.now }, // Timestamp of check
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional: reference to user who checked
});

module.exports = mongoose.model("PhishingURL", PhishingURLSchema);
