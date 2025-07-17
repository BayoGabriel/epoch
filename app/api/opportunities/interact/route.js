// api/opportunities/interact
import connectMongo from '@/utils/mongodb';
import UserOpportunityInteraction from '@/models/UserOpportunityInteraction';

export async function POST(req) {
  try {
    await connectMongo();
    const { opportunityId, userId, status } = await req.json();

    if (!opportunityId || !userId || !status) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    // Try to find existing interaction
    let interaction = await UserOpportunityInteraction.findOne({
      user: userId,
      opportunity: opportunityId
    });

    if (interaction) {
      // If the status is the same, remove the interaction (toggle off)
      if (interaction.status === status) {
        await UserOpportunityInteraction.deleteOne({ _id: interaction._id });
        return new Response(
          JSON.stringify({ message: `${status} status removed` }),
          { status: 200 }
        );
      }
      // Update existing interaction with new status
      interaction.status = status;
      interaction.dateInteracted = new Date();
      await interaction.save();
    } else {
      // Create new interaction
      interaction = new UserOpportunityInteraction({
        user: userId,
        opportunity: opportunityId,
        status
      });
      await interaction.save();
    }

    return new Response(
      JSON.stringify(interaction),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in opportunity interaction:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to process interaction', error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const opportunityId = url.searchParams.get('opportunityId');

    if (!userId || !opportunityId) {
      return new Response(
        JSON.stringify({ message: 'Missing required parameters' }),
        { status: 400 }
      );
    }

    const interactions = await UserOpportunityInteraction.find({
      user: userId,
      opportunity: opportunityId
    });

    return new Response(
      JSON.stringify(interactions),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching interactions:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch interactions', error: error.message }),
      { status: 500 }
    );
  }
}
