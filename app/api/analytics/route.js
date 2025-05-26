// // app/api/analytics/route.js
// import { NextResponse } from "next/server"
// import dbConnect from "@/utils/mongodb"
// import Analytics from "@/models/analytics"
// import Opportunity from "@/models/opportunity"
// import UserOpportunityInteraction from "@/models/UserOpportunityInteraction"

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const startDate = searchParams.get("startDate")
//       ? new Date(searchParams.get("startDate"))
//       : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default to 30 days ago

//     const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : new Date() // Default to now

//     const opportunityType = searchParams.get("opportunityType")
//     const timeFilter = searchParams.get("timeFilter") || "daily"

//     await dbConnect()

//     // Base query for filtering by date range
//     const dateQuery = {
//       timestamp: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     }

//     // Add opportunity type filter if provided
//     let opportunityQuery = {}
//     if (opportunityType && opportunityType !== "all") {
//       const opportunities = await Opportunity.find({ type: opportunityType }).select("_id")
//       const opportunityIds = opportunities.map((opp) => opp._id)

//       opportunityQuery = {
//         "metadata.opportunityId": { $in: opportunityIds },
//       }
//     }

//     // Combine queries
//     const query = {
//       ...dateQuery,
//       ...opportunityQuery,
//     }

//     // Get total counts
//     const totalVisitors = await Analytics.distinct("userId", {
//       ...query,
//       event: "pageview",
//     }).then((ids) => ids.length)

//     const totalPageviews = await Analytics.countDocuments({
//       ...query,
//       event: "pageview",
//     })

//     const totalOpportunityViews = await Analytics.countDocuments({
//       ...query,
//       event: "opportunity_view",
//     })

//     const totalOpportunityInteractions = await Analytics.countDocuments({
//       ...query,
//       event: { $in: ["opportunity_view", "opportunity_track", "opportunity_interact", "opportunity_apply"] },
//     })

//     // Get time series data based on the selected time filter
//     let timeSeriesData

//     if (timeFilter === "weekly") {
//       timeSeriesData = await getWeeklyData(query)
//     } else if (timeFilter === "monthly") {
//       timeSeriesData = await getMonthlyData(query)
//     } else {
//       timeSeriesData = await getDailyData(query, startDate, endDate)
//     }

//     // Get top opportunities
//     const topOpportunities = await getTopOpportunities(query)

//     // Get opportunity type distribution
//     const opportunityTypeDistribution = await getOpportunityTypeDistribution(query)

//     return NextResponse.json({
//       totalVisitors,
//       totalPageviews,
//       totalOpportunityViews,
//       totalOpportunityInteractions,
//       timeSeriesData,
//       topOpportunities,
//       opportunityTypeDistribution,
//       weeklyGrowth: 12.5, // Placeholder - would calculate from previous period
//       monthlyGrowth: 32.8, // Placeholder - would calculate from previous period
//     })
//   } catch (error) {
//     console.error("Analytics API Error:", error)
//     return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
//   }
// }

// // Helper function to get daily data
// async function getDailyData(query, startDate, endDate) {
//   const pipeline = [
//     { $match: query },
//     {
//       $group: {
//         _id: {
//           year: { $year: "$timestamp" },
//           month: { $month: "$timestamp" },
//           day: { $dayOfMonth: "$timestamp" },
//         },
//         visitors: { $addToSet: "$userId" },
//         pageviews: {
//           $sum: { $cond: [{ $eq: ["$event", "pageview"] }, 1, 0] },
//         },
//         opportunityViews: {
//           $sum: { $cond: [{ $eq: ["$event", "opportunity_view"] }, 1, 0] },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         date: {
//           $dateFromParts: {
//             year: "$_id.year",
//             month: "$_id.month",
//             day: "$_id.day",
//           },
//         },
//         visitors: { $size: "$visitors" },
//         pageviews: 1,
//         opportunityViews: 1,
//       },
//     },
//     { $sort: { date: 1 } },
//   ]

//   const results = await Analytics.aggregate(pipeline)

//   // Format the results
//   return {
//     dates: results.map((r) => r.date.toISOString().split("T")[0]),
//     visitors: results.map((r) => r.visitors),
//     pageviews: results.map((r) => r.pageviews),
//     opportunityViews: results.map((r) => r.opportunityViews),
//   }
// }

// // Helper function to get weekly data
// async function getWeeklyData(query) {
//   const pipeline = [
//     { $match: query },
//     {
//       $group: {
//         _id: {
//           year: { $year: "$timestamp" },
//           week: { $week: "$timestamp" },
//         },
//         visitors: { $addToSet: "$userId" },
//         pageviews: {
//           $sum: { $cond: [{ $eq: ["$event", "pageview"] }, 1, 0] },
//         },
//         opportunityViews: {
//           $sum: { $cond: [{ $eq: ["$event", "opportunity_view"] }, 1, 0] },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         year: "$_id.year",
//         week: "$_id.week",
//         visitors: { $size: "$visitors" },
//         pageviews: 1,
//         opportunityViews: 1,
//       },
//     },
//     { $sort: { year: 1, week: 1 } },
//   ]

//   const results = await Analytics.aggregate(pipeline)

//   // Format the results
//   return {
//     dates: results.map((r) => `Week ${r.week}`),
//     visitors: results.map((r) => r.visitors),
//     pageviews: results.map((r) => r.pageviews),
//     opportunityViews: results.map((r) => r.opportunityViews),
//   }
// }

// // Helper function to get monthly data
// async function getMonthlyData(query) {
//   const pipeline = [
//     { $match: query },
//     {
//       $group: {
//         _id: {
//           year: { $year: "$timestamp" },
//           month: { $month: "$timestamp" },
//         },
//         visitors: { $addToSet: "$userId" },
//         pageviews: {
//           $sum: { $cond: [{ $eq: ["$event", "pageview"] }, 1, 0] },
//         },
//         opportunityViews: {
//           $sum: { $cond: [{ $eq: ["$event", "opportunity_view"] }, 1, 0] },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         date: {
//           $dateFromParts: {
//             year: "$_id.year",
//             month: "$_id.month",
//             day: 1,
//           },
//         },
//         visitors: { $size: "$visitors" },
//         pageviews: 1,
//         opportunityViews: 1,
//       },
//     },
//     { $sort: { date: 1 } },
//   ]

//   const results = await Analytics.aggregate(pipeline)

//   // Format the results
//   return {
//     dates: results.map((r) => {
//       const date = new Date(r.date)
//       return date.toLocaleString("default", { month: "short" })
//     }),
//     visitors: results.map((r) => r.visitors),
//     pageviews: results.map((r) => r.pageviews),
//     opportunityViews: results.map((r) => r.opportunityViews),
//   }
// }

// // Helper function to get top opportunities
// async function getTopOpportunities(query) {
//   // First get the most viewed opportunities
//   const pipeline = [
//     {
//       $match: {
//         ...query,
//         event: "opportunity_view",
//         "metadata.opportunityId": { $exists: true },
//       },
//     },
//     {
//       $group: {
//         _id: "$metadata.opportunityId",
//         views: { $sum: 1 },
//         uniqueVisitors: { $addToSet: "$userId" },
//       },
//     },
//     { $sort: { views: -1 } },
//     { $limit: 10 },
//   ]

//   const viewResults = await Analytics.aggregate(pipeline)

//   // Get opportunity details
//   const opportunityIds = viewResults.map((r) => r._id)
//   const opportunities = await Opportunity.find({ _id: { $in: opportunityIds } })

//   // Get interaction counts
//   const interactionCounts = await Analytics.aggregate([
//     {
//       $match: {
//         "metadata.opportunityId": { $in: opportunityIds },
//         event: { $in: ["opportunity_interact", "opportunity_track", "opportunity_apply"] },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           opportunityId: "$metadata.opportunityId",
//           event: "$event",
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ])

//   // Get application counts from UserOpportunityInteraction
//   const applicationCounts = await UserOpportunityInteraction.aggregate([
//     {
//       $match: {
//         opportunity: { $in: opportunityIds },
//         status: "applied",
//       },
//     },
//     {
//       $group: {
//         _id: "$opportunity",
//         count: { $sum: 1 },
//       },
//     },
//   ])

//   // Get tracking counts from UserOpportunityInteraction
//   const trackingCounts = await UserOpportunityInteraction.aggregate([
//     {
//       $match: {
//         opportunity: { $in: opportunityIds },
//         status: "tracking",
//       },
//     },
//     {
//       $group: {
//         _id: "$opportunity",
//         count: { $sum: 1 },
//       },
//     },
//   ])

//   // Combine all data
//   return viewResults.map((result) => {
//     const opportunity = opportunities.find((o) => o._id.toString() === result._id.toString())

//     // Get interaction counts
//     const interactions = interactionCounts
//       .filter((i) => i._id.opportunityId.toString() === result._id.toString())
//       .reduce((acc, curr) => {
//         acc[curr._id.event.replace("opportunity_", "")] = curr.count
//         return acc
//       }, {})

//     // Get application count
//     const applies = applicationCounts.find((a) => a._id.toString() === result._id.toString())?.count || 0

//     // Get tracking count
//     const tracks = trackingCounts.find((t) => t._id.toString() === result._id.toString())?.count || 0

//     // Calculate conversion rate
//     const conversionRate = result.views > 0 ? ((tracks + applies) / result.views) * 100 : 0

//     // Calculate apply rate
//     const applyRate = result.views > 0 ? (applies / result.views) * 100 : 0

//     return {
//       _id: result._id.toString(),
//       title: opportunity?.title || "Unknown Opportunity",
//       company: opportunity?.institution || "Unknown Company",
//       type: opportunity?.type || "Unknown Type",
//       location: opportunity?.location || "Unknown Location",
//       views: result.views,
//       uniqueVisitors: result.uniqueVisitors.length,
//       interactions: Object.values(interactions).reduce((a, b) => a + b, 0),
//       tracks,
//       applies,
//       conversionRate,
//       applyRate,
//     }
//   })
// }

// // Helper function to get opportunity type distribution
// async function getOpportunityTypeDistribution(query) {
//   // First get all opportunity views
//   const opportunityViews = await Analytics.find({
//     ...query,
//     event: "opportunity_view",
//     "metadata.opportunityId": { $exists: true },
//   }).select("metadata.opportunityId")

//   // Get all opportunity IDs
//   const opportunityIds = opportunityViews.map((view) => view.metadata.opportunityId)

//   // Get opportunity types
//   const opportunityTypes = await Opportunity.aggregate([
//     {
//       $match: {
//         _id: { $in: opportunityIds },
//       },
//     },
//     {
//       $group: {
//         _id: "$type",
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { count: -1 },
//     },
//   ])

//   // Format the results
//   const result = {}
//   opportunityTypes.forEach((type) => {
//     result[type._id.charAt(0).toUpperCase() + type._id.slice(1)] = type.count
//   })

//   return result
// }
