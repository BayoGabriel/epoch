import cron from 'node-cron';
import mongoose from 'mongoose';
import Opportunity from '@/models/opportunity';
import clientPromise from '@/utils/mongodb';

// Connect to MongoDB (if not already connected)
async function connectToDB() {
  if (!mongoose.connection.readyState) {
    clientPromise;
  }
}

// Define the task to update expired opportunities
async function updateOpportunityStatus() {
  try {
    await connectToDB();
    const now = new Date();

    // Find and update opportunities whose deadlines have passed
    const result = await Opportunity.updateMany(
      { deadline: { $lte: now }, status: { $ne: 'expired' } },
      { $set: { status: 'expired' } }
    );

    console.log(`Updated ${result.modifiedCount} expired opportunities.`);
  } catch (error) {
    console.error('Error updating opportunities:', error);
  }
}

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled job: Update expired opportunities');
  await updateOpportunityStatus();
});
