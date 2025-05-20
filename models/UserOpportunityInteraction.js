// models/UserOpportunityInteraction.js
import mongoose from 'mongoose';

const UserOpportunityInteractionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  opportunity: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Opportunity', 
    required: true 
  },
  status: {
    type: String,
    enum: ['applied', 'tracking'],
    required: true
  },
  dateInteracted: {
    type: Date,
    default: Date.now
  }
});

UserOpportunityInteractionSchema.index({ user: 1, opportunity: 1 }, { unique: true });

export default mongoose.models.UserOpportunityInteraction || 
  mongoose.model('UserOpportunityInteraction', UserOpportunityInteractionSchema);
