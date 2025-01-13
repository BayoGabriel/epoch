import { NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';
import { subDays } from 'date-fns';

export async function GET(request) {
  try {
    await connectMongo();
    const url = new URL(request.url);
    const week = url.searchParams.get('week');

    // Base query for approved opportunities
    const baseQuery = {
      status: 'approved'
    };

    // Add date filter if week parameter is provided
    if (week) {
      const dateThreshold = subDays(new Date(), parseInt(week));
      baseQuery.dateCreated = { $gte: dateThreshold };
    }

    const opportunities = await Opportunity.find(baseQuery)
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
