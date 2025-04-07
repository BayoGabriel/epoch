export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    await connectMongo();

    // Get all opportunities for admin, including archived ones
    const opportunities = await Opportunity.find()
      .sort({ dateCreated: -1 });

    return new NextResponse(
      JSON.stringify(opportunities),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching opportunities' }),
      { status: 500 }
    );
  }
}
