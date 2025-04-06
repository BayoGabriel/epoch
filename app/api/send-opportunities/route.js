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
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
  // Add rate limiting
  pool: true,
  maxConnections: 5,
  maxMessages: 10,
  rateDelta: 1000, // 1 second between messages in the same connection
});

// Fetch subscribers from the specific Sender.net group with pagination support
async function fetchAllSubscribersFromGroup() {
  try {
    let allSubscribers = [];
    let page = 1;
    let hasMorePages = true;
    const limit = 100; // Get max number of subscribers per request

    while (hasMorePages) {
      const response = await axios.get(
        `https://api.sender.net/v2/groups/erXrJB/subscribers`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SENDER_API_KEY}`,
            "Content-Type": "application/json",
          },
          params: {
            page: page,
            limit: limit,
          },
        }
      );

      const subscribers = response.data.data.map((subscriber) => subscriber.email);
      allSubscribers = [...allSubscribers, ...subscribers];
      
      // Check if we need to fetch more pages
      const total = response.data.meta?.total || 0;
      const currentCount = page * limit;
      
      if (subscribers.length < limit || currentCount >= total) {
        hasMorePages = false;
      } else {
        page++;
      }
      
      // Add a delay between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Total subscribers fetched: ${allSubscribers.length}`);
    return allSubscribers;
  } catch (error) {
    console.error("Error fetching group subscribers:", error);
    return [];
  }
}

// Helper function to send emails in batches
async function sendEmailInBatches(subscribers, emailHtml) {
  const batchSize = 10; // Send 10 emails at a time
  const delayBetweenBatches = 10000; // 10 seconds between batches
  const results = { success: 0, failed: [] };

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    // Process each email in the current batch
    const promises = batch.map(async (email) => {
      try {
        await transporter.sendMail({
          from: `"Epoch Africa" <${process.env.ZOHO_USER}>`,
          to: email,
          subject: "OPPORTUNITIES FOR THE WEEK",
          html: emailHtml,
        });
        results.success++;
        return { email, success: true };
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        results.failed.push(email);
        return { email, success: false, error: error.message };
      }
    });

    await Promise.all(promises);
    
    // Only wait between batches if we have more batches to process
    if (i + batchSize < subscribers.length) {
      console.log(`Completed batch ${Math.floor(i / batchSize) + 1}. Waiting before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
}

export async function GET() {
  try {
    await connectMongo();

    // Fetch unexpired opportunities sorted by most recent
    const opportunities = await Opportunity.find({
      status: "approved",
      applicationDeadline: { $gte: new Date() },
    }).sort({ dateCreated: -1 });

    if (opportunities.length === 0) {
      return NextResponse.json({ message: "No new opportunities to send." });
    }

    // Fetch all subscribers with pagination support
    const subscribers = await fetchAllSubscribersFromGroup();
    
    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers found in the group." });
    }

    console.log(`Preparing to send emails to ${subscribers.length} subscribers`);

    // Render email content once since it's the same for all subscribers
    const emailHtml = await render(<OpportunitiesEmail opportunities={opportunities} />);

    // Send emails in batches
    const results = await sendEmailInBatches(subscribers, emailHtml);

    return NextResponse.json({
      message: `Successfully sent emails to ${results.success} out of ${subscribers.length} subscribers.`,
      failedCount: results.failed.length,
      failedEmails: results.failed.length > 0 ? results.failed : undefined,
      totalSubscribers: subscribers.length
    });
  } catch (error) {
    console.error("Error sending weekly opportunities:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}