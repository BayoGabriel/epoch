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
    default: 'https://res.cloudinary.com/dq1uyidfy/image/upload/v1736844758/opp_yby0nw.svg'
  },
  applyLink: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'archived', 'expired'], 
    default: 'pending' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Add a method to check if an opportunity should be archived
OpportunitySchema.methods.shouldArchive = function() {
  return new Date() > new Date(this.applicationDeadline);
};

// Add a static method to archive expired opportunities
OpportunitySchema.statics.archiveExpired = async function() {
  const now = new Date();
  return this.updateMany(
    {
      applicationDeadline: { $lt: now },
      status: { $ne: 'archived' }
    },
    { $set: { status: 'archived' } }
  );
};

export default mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);
