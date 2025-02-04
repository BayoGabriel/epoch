import { NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';

export async function GET(req) {
  try {
    // Verify the request is from a cron job
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer hafeoprwcfuvhhjica123odugfiuflcbl`) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    await connectMongo();
    const result = await Opportunity.archiveExpired();

    return new NextResponse(
      JSON.stringify({ 
        message: 'Successfully archived expired opportunities',
        updated: result.modifiedCount 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error archiving opportunities:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error archiving opportunities' }),
      { status: 500 }
    );
  }
}
