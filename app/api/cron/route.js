import { NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/Opportunity';

export async function GET() {
  try {
    await connectMongo();

    // Get current date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all opportunities that have passed their deadline
    const expiredOpportunities = await Opportunity.find({
      deadline: { $lt: today },
      status: { $ne: 'archived' } // Only get non-archived opportunities
    });

    // Update all expired opportunities to archived status
    if (expiredOpportunities.length > 0) {
      await Opportunity.updateMany(
        { _id: { $in: expiredOpportunities.map(opp => opp._id) } },
        { $set: { status: 'archived' } }
      );
    }

    return NextResponse.json({
      message: `Successfully archived ${expiredOpportunities.length} expired opportunities`,
      archivedCount: expiredOpportunities.length
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to archive opportunities' },
      { status: 500 }
    );
  }
}
