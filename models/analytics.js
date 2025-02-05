import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to the user if logged in
  sessionId: String,  // To group activities in a single session
  url: String,
  ip: String,
  location: Object,
  userAgent: String,
  event: {
    type: String,
    enum: ['pageview', 'login', 'signup', 'opportunity_view', 'opportunity_track', 'opportunity_interact', 'session_start', 'session_end']
  },
  target: String,  // Element clicked or opportunity ID
  metadata: {
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
    interactionType: String,  // For opportunity interactions: view, track, apply, etc.
    sessionDuration: Number,  // Session duration in ms
    previousPage: String,     // For tracking user flow
  },
  timestamp: { type: Date, default: Date.now },
});

// Add index for better query performance
AnalyticsSchema.index({ userId: 1, timestamp: -1 });
AnalyticsSchema.index({ sessionId: 1 });
AnalyticsSchema.index({ event: 1 });

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
