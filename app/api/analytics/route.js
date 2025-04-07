export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import connectMongo from "@/utils/mongodb";
import Analytics from "@/models/analytics";

// Handle POST requests
export async function POST(req) {
  await connectMongo();
  try {
    const data = await req.json();
    if (!data.event) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await Analytics.create(data);
    return NextResponse.json({ message: "Analytics saved" }, { status: 201 });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ message: "Error saving analytics" }, { status: 500 });
  }
}
