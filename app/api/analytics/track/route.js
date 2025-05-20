import { NextResponse } from "next/server"
import Analytics from "@/models/analytics"
import Opportunity from "@/models/opportunity"
import dbConnect from "@/utils/mongodb"

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect()

    // Get the analytics data from the request body
    const analyticsData = await request.json()

    // Add IP address from request headers
    const forwardedFor = request.headers.get("x-forwarded-for")
    analyticsData.ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown"

    // If this is an opportunity view, increment the view count in the Opportunity model
    if (analyticsData.event === "opportunity_view" && analyticsData.metadata && analyticsData.metadata.opportunityId) {
      try {
        await Opportunity.findByIdAndUpdate(analyticsData.metadata.opportunityId, { $inc: { views: 1 } })
      } catch (err) {
        console.error("Error updating opportunity view count:", err)
      }
    }

    // If this is an opportunity apply, increment the applications count in the Opportunity model
    if (analyticsData.event === "opportunity_apply" && analyticsData.metadata && analyticsData.metadata.opportunityId) {
      try {
        await Opportunity.findByIdAndUpdate(analyticsData.metadata.opportunityId, { $inc: { applications: 1 } })
      } catch (err) {
        console.error("Error updating opportunity applications count:", err)
      }
    }

    // Insert the analytics data into the database
    await Analytics.create(analyticsData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ error: "Failed to track analytics data" }, { status: 500 })
  }
}
