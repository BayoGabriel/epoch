import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  url: String,
  ip: String,
  location: Object,
  userAgent: String,
  event: String,  // "visit", "click", "session_duration"
  target: String,  // Element clicked
  duration: Number,  // Session duration in ms
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
