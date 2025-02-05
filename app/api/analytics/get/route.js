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

    const now = new Date();
    const lastWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);

    // Get various analytics metrics
    const [
      totalVisits,
      lastWeekVisits,
      avgSessionDuration,
      pageViews,
      userLocations,
      opportunityInteractions,
      userEngagement,
      activeUsers,
      topOpportunities
    ] = await Promise.all([
      // Total visits (unique sessions)
      Analytics.countDocuments({ event: "session_start" }),
      
      // Last week visits
      Analytics.countDocuments({
        event: "session_start",
        timestamp: { $gte: lastWeek }
      }),

      // Average session duration
      Analytics.aggregate([
        { $match: { event: "session_end" } },
        { $group: { _id: null, avg: { $avg: "$metadata.sessionDuration" } } }
      ]),

      // Page views by URL
      Analytics.aggregate([
        { $match: { event: "pageview" } },
        { $group: { _id: "$url", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // User locations
      Analytics.aggregate([
        { $match: { location: { $exists: true } } },
        { $group: { _id: "$location.country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // Opportunity interactions
      Analytics.aggregate([
        { $match: { event: "opportunity_interact" } },
        { $group: { 
          _id: "$metadata.interactionType",
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } }
      ]),

      // User engagement (sessions with interactions)
      Analytics.aggregate([
        { $match: { event: "session_end" } },
        { $bucket: {
          groupBy: "$metadata.sessionDuration",
          boundaries: [0, 60000, 300000, 900000, 1800000, Infinity],
          default: "other",
          output: {
            count: { $sum: 1 },
            avg_duration: { $avg: "$metadata.sessionDuration" }
          }
        }}
      ]),

      // Active users (users with multiple sessions)
      Analytics.aggregate([
        { $match: { 
          event: "session_start",
          userId: { $exists: true },
          timestamp: { $gte: lastWeek }
        }},
        { $group: { 
          _id: "$userId",
          sessions: { $sum: 1 }
        }},
        { $group: {
          _id: null,
          total: { $sum: 1 },
          returning: { 
            $sum: { $cond: [{ $gt: ["$sessions", 1] }, 1, 0] }
          }
        }}
      ]),

      // Top opportunities by views and interactions
      Analytics.aggregate([
        { $match: { 
          event: "opportunity_interact",
          "metadata.opportunityId": { $exists: true }
        }},
        { $group: { 
          _id: "$metadata.opportunityId",
          views: { 
            $sum: { $cond: [{ $eq: ["$metadata.interactionType", "view"] }, 1, 0] }
          },
          interactions: { 
            $sum: { $cond: [{ $ne: ["$metadata.interactionType", "view"] }, 1, 0] }
          }
        }},
        { $sort: { interactions: -1 } },
        { $limit: 10 }
      ])
    ]);

    return NextResponse.json({
      totalVisits,
      lastWeekVisits,
      avgSessionDuration: avgSessionDuration[0]?.avg || 0,
      pageViews,
      userLocations,
      opportunityInteractions,
      userEngagement,
      activeUsers: activeUsers[0] || { total: 0, returning: 0 },
      topOpportunities
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ message: "Error fetching analytics" }, { status: 500 });
  }
}
