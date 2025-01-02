import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';
import { subDays } from 'date-fns';

export async function GET(request) {
  await connectMongo();

  const url = new URL(request.url);
  const week = url.searchParams.get('week');  // e.g., "7", "28" or null

  try {
    let opportunities;

    if (week) {
      // Filter based on the number of past days
      const dateThreshold = subDays(new Date(), parseInt(week));
      opportunities = await Opportunity.find({
        status: 'approved',
        dateCreated: { $gte: dateThreshold }
      }).sort({ dateCreated: -1 }); // Sort by dateCreated in descending order
    } else {
      // Fetch all opportunities (no date filtering) and sort by most recent
      opportunities = await Opportunity.find({ status: 'approved' }).sort({ dateCreated: -1 });
    }

    return new Response(JSON.stringify(opportunities), { status: 200 });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return new Response(JSON.stringify({ message: 'Error fetching opportunities' }), { status: 500 });
  }
}
