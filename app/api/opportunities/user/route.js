export const dynamic = 'force-dynamic';
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
      .populate({
        path: 'opportunity',
        match: { status: { $ne: 'archived' } } // Only get non-archived opportunities
      })
      .sort({ dateInteracted: -1 });

    // Filter out interactions where opportunity is null (deleted or archived)
    const validInteractions = interactions.filter(i => i.opportunity !== null);

    // Group valid interactions by status
    const groupedInteractions = {
      applied: validInteractions
        .filter(i => i.status === 'applied')
        .map(i => ({
          ...i.opportunity.toObject(),
          interactionStatus: 'applied',
          dateInteracted: i.dateInteracted
        })),
      tracking: validInteractions
        .filter(i => i.status === 'tracking')
        .map(i => ({
          ...i.opportunity.toObject(),
          interactionStatus: 'tracking',
          dateInteracted: i.dateInteracted
        }))
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
