import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['internship', 'scholarship', 'job', 'volunteer', 'ambassadorship', 'training'], required: true },
  institution: { type: String, required: true },
  position: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  applicationDeadline: { type: Date, required: true },
  imageUrl: { 
    type: String,
    default: 'https://res.cloudinary.com/dq1uyidfy/image/upload/v1704993600/opportunities/default_opportunity.png'
  },
  applyLink: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'expired'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);
