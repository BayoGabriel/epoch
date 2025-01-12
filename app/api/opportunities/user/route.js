import connectMongo from '@/utils/mongodb';
import UserOpportunityInteraction from '@/models/UserOpportunityInteraction';

export async function GET(req) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'User ID is required' }),
        { status: 400 }
      );
    }

    // Find all interactions for the user and populate opportunity details
    const interactions = await UserOpportunityInteraction.find({ user: userId })
      .populate('opportunity')
      .sort({ dateInteracted: -1 });

    // Group interactions by status
    const groupedInteractions = {
      applied: interactions.filter(i => i.status === 'applied').map(i => i.opportunity),
      tracking: interactions.filter(i => i.status === 'tracking').map(i => i.opportunity)
    };

    return new Response(
      JSON.stringify(groupedInteractions),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching user opportunities:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch opportunities', error: error.message }),
      { status: 500 }
    );
  }
}
