import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  title: { type: String,  },
  description: { type: String,  },
  type: { type: String, enum: ['internship', 'scholarship', 'job', 'volunteer', 'ambassadorship', 'training'],  },
  institution: { type: String,  },
  position: { type: String,  },
  dateCreated: { type: Date, default: Date.now },
  applicationDeadline: { type: Date,  },
  imageUrl: { 
    type: String,
    default: 'https://res.cloudinary.com/dq1uyidfy/image/upload/v1736844758/opp_yby0nw.svg'
  },
  applyLink: { type: String,  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'archived', 'expired'], 
    default: 'pending' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  },
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
