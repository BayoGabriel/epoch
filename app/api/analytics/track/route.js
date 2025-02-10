import { NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb';
import Analytics from '@/models/analytics';

export async function POST(request) {
  try {
    const data = await request.json();
    await connectMongo();

    const analytics = new Analytics({
      userId: data.userId,
      sessionId: data.sessionId,
      url: data.path,
      ip: data.ip,
      event: data.type,
      target: data.target,
      metadata: {
        opportunityId: data.opportunityId,
        interactionType: data.interactionType,
        sessionDuration: data.sessionDuration,
        previousPage: data.previousPage,
      },
      timestamp: data.timestamp || new Date(),
    });

    await analytics.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}
