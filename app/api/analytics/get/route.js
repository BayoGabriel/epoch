import { NextResponse } from "next/server";
import connectMongo from "@/utils/mongodb";
import Analytics from "@/models/analytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Get various analytics metrics
    const [
      totalVisits,
      lastWeekVisits,
      clickEvents,
      avgSessionDuration,
      pageViews,
      userLocations
    ] = await Promise.all([
      Analytics.countDocuments({ event: "visit" }),
      Analytics.countDocuments({
        event: "visit",
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Analytics.aggregate([
        { $match: { event: "click" } },
        { $group: { _id: "$target", count: { $sum: 1 } } }
      ]),
      Analytics.aggregate([
        { $match: { event: "session_duration" } },
        { $group: { _id: null, avg: { $avg: "$duration" } } }
      ]),
      Analytics.aggregate([
        { $match: { event: "visit" } },
        { $group: { _id: "$url", count: { $sum: 1 } } }
      ]),
      Analytics.aggregate([
        { $match: { location: { $exists: true } } },
        { $group: { _id: "$location.country", count: { $sum: 1 } } }
      ])
    ]);

    return NextResponse.json({
      totalVisits,
      lastWeekVisits,
      clickEvents,
      avgSessionDuration: avgSessionDuration[0]?.avg || 0,
      pageViews,
      userLocations
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ message: "Error fetching analytics" }, { status: 500 });
  }
}
