import { NextResponse } from "next/server";
import connectMongo from "@/utils/mongodb";
import Analytics from "@/models/analytics";

// Handle GET requests
export async function GET() {
  await connectMongo();
  try {
    const data = await Analytics.find().sort({ timestamp: -1 }).limit(100);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GetAnalytics API Error:", error);
    return NextResponse.json({ message: "Error fetching analytics" }, { status: 500 });
  }
}
