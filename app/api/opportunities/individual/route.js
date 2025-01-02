import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';

export async function GET(request) {
  await connectMongo();

  // Extracting the `id` from the query parameters
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(
      JSON.stringify({ message: 'No opportunity ID provided' }),
      { status: 400 }
    );
  }

  try {
    // Fetch the opportunity by its ID
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return new Response(
        JSON.stringify({ message: 'Opportunity not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(opportunity), { status: 200 });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching opportunity' }),
      { status: 500 }
    );
  }
}
