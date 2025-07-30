// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/mongodb";
// import Analytics from "@/models/analytics";
// import Opportunity from "@/models/opportunity";

// // GET /api/analytics?startDate=...&endDate=...&timeFilter=weekly|monthly|daily
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const startDate = searchParams.get("startDate")
//       ? new Date(searchParams.get("startDate"))
//       : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
//     const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : new Date();
//     const timeFilter = searchParams.get("timeFilter") || "daily";

//     await dbConnect();

//     // Base query for filtering by date range
//     const dateQuery = {
//       timestamp: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     };

//     // Get total counts
//     const totalVisitors = await Analytics.distinct("userId", {
//       ...dateQuery,
//       event: "pageview",
//     }).then((ids) => ids.length);
//     const totalPageviews = await Analytics.countDocuments({
//       ...dateQuery,
//       event: "pageview",
//     });
//     const totalOpportunityViews = await Analytics.countDocuments({
//       ...dateQuery,
//       event: "opportunity_view",
//     });

//     // Get top opportunities by views
//     const topOpportunitiesPipeline = [
//       { $match: { ...dateQuery, event: "opportunity_view", "metadata.opportunityId": { $exists: true } } },
//       { $group: { _id: "$metadata.opportunityId", views: { $sum: 1 } } },
//       { $sort: { views: -1 } },
//       { $limit: 5 },
//     ];
//     const topOpportunitiesAgg = await Analytics.aggregate(topOpportunitiesPipeline);
//     const topOpportunityIds = topOpportunitiesAgg.map((r) => r._id);
//     const topOpportunitiesDetails = await Opportunity.find({ _id: { $in: topOpportunityIds } }).select("title slug institution type");
//     const topOpportunities = topOpportunitiesAgg.map((agg) => {
//       const details = topOpportunitiesDetails.find((o) => o._id.equals(agg._id));
//       return details ? { ...details.toObject(), views: agg.views } : null;
//     }).filter(Boolean);

//     // Time series data (daily/weekly/monthly)
//     let timeSeriesData = [];
//     let groupStage;
//     if (timeFilter === "weekly") {
//       groupStage = {
//         _id: { year: { $year: "$timestamp" }, week: { $week: "$timestamp" } },
//         pageviews: { $sum: { $cond: [{ $eq: ["$event", "pageview"] }, 1, 0] } },
//         opportunityViews: { $sum: { $cond: [{ $eq: ["$event", "opportunity_view"] }, 1, 0] } },
//       };
//     } else if (timeFilter === "monthly") {
//       groupStage = {
//         _id: { year: { $year: "$timestamp" }, month: { $month: "$timestamp" } },
//         pageviews: { $sum: { $cond: [{ $eq: ["$event", "pageview"] }, 1, 0] } },
//         opportunityViews: { $sum: { $cond: [{ $eq: ["$event", "opportunity_view"] }, 1, 0] } },
//       };
//     } else {
//       groupStage = {
//         _id: { year: { $year: "$timestamp" }, month: { $month: "$timestamp" }, day: { $dayOfMonth: "$timestamp" } },
//         pageviews: { $sum: { $cond: [{ $eq: ["$event", "pageview"] }, 1, 0] } },
//         opportunityViews: { $sum: { $cond: [{ $eq: ["$event", "opportunity_view"] }, 1, 0] } },
//       };
//     }
//     const timeSeriesPipeline = [
//       { $match: dateQuery },
//       { $group: groupStage },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
//     ];
//     timeSeriesData = await Analytics.aggregate(timeSeriesPipeline);

//     return NextResponse.json({
//       totalVisitors,
//       totalPageviews,
//       totalOpportunityViews,
//       topOpportunities,
//       timeSeriesData,
//     });
//   } catch (error) {
//     console.error("Analytics API Error:", error);
//     return NextResponse.json({ error: "Failed to fetch analytics data", details: error.message }, { status: 500 });
//   }
// }
