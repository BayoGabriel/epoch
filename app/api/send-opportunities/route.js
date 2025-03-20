import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import OpportunitiesEmail from "@/components/emails/Welcome";
import connectMongo from "@/utils/mongodb";
import Opportunity from "@/models/opportunity";
import axios from "axios";

// Configure Nodemailer with Zoho Mail
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_USER, // Your Zoho email
    pass: process.env.ZOHO_PASS, // Your Zoho app password
  },
});

// Fetch subscribers from the specific Sender.net group
async function fetchSubscribersFromGroup() {
  try {
    const response = await axios.get(
      "https://api.sender.net/v2/groups/e5VkK8/subscribers",
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.map((subscriber) => subscriber.email);
  } catch (error) {
    console.error("Error fetching group subscribers:", error);
    return [];
  }
}

export async function GET() {
  try {
    await connectMongo();

    // Fetch unexpired opportunities sorted by most recent
    const opportunities = await Opportunity.find({
      status: "approved",
      applicationDeadline: { $gte: new Date() },
    }).sort({ dateCreated: -1 });

    if (opportunities.length === 0)
      return NextResponse.json({ message: "No new opportunities to send." });

    const subscribers = await fetchSubscribersFromGroup();
    if (subscribers.length === 0)
      return NextResponse.json({ message: "No subscribers found in the group." });

    const emailHtml = await render(<OpportunitiesEmail opportunities={opportunities} />);


    // Send email using Zoho Mail
    await transporter.sendMail({
      from: `"Epoch Africa" <${process.env.ZOHO_USER}>`,
      to: subscribers.join(","),
      subject: "OPPORTUNITIES FOR THE WEEK",
      html: emailHtml,
    });

    return NextResponse.json({ message: `Emails sent to ${subscribers.length} subscribers.` });
  } catch (error) {
    console.error("Error sending weekly opportunities:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}
