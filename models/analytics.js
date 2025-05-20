import mongoose from "mongoose"

// Define the schema
const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    sparse: true, // Allow null values
  },
  sessionId: String, // To group activities in a single session
  url: String,
  ip: String,
  location: Object,
  userAgent: String,
  event: {
    type: String,
    enum: [
      "pageview",
      "login",
      "signup",
      "opportunity_view",
      "opportunity_track",
      "opportunity_interact",
      "opportunity_apply",
      "session_start",
      "session_end",
    ],
  },
  target: String, // Element clicked or opportunity ID
  metadata: {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      sparse: true, // Allow null values
    },
    interactionType: String, // For opportunity interactions: view, track, apply, etc.
    sessionDuration: Number, // Session duration in ms
    previousPage: String, // For tracking user flow
    additionalData: mongoose.Schema.Types.Mixed, // For any additional data
  },
  timestamp: { type: Date, default: Date.now },
})

// Add indexes for better query performance
AnalyticsSchema.index({ userId: 1, timestamp: -1 })
AnalyticsSchema.index({ sessionId: 1 })
AnalyticsSchema.index({ event: 1 })
AnalyticsSchema.index({ "metadata.opportunityId": 1 })
AnalyticsSchema.index({ timestamp: 1 })

// Check if the model already exists to prevent recompilation error
const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema)

export default Analytics
