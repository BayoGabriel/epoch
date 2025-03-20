import cron from "node-cron";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import OpportunitiesEmail from "@/components/emails/Welcome";
import connectMongo from "@/utils/mongodb";
import Opportunity from "@/models/opportunity";
import axios from "axios";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function fetchSubscribers() {
  try {
    const response = await axios.get("https://api.sender.net/v2/groups/e5VkK8/subscribers", {
      headers: { Authorization: `Bearer ${process.env.SENDER_API_KEY}` },
    });
    return response.data.data.map((subscriber) => subscriber.email);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}

async function sendWeeklyOpportunities() {
  try {
    await connectMongo();

    // Fetch unexpired opportunities, sorted by most recent
    const opportunities = await Opportunity.find({
      status: "approved",
      applicationDeadline: { $gte: new Date() },
    }).sort({ dateCreated: -1 });

    if (opportunities.length === 0) return console.log("No new opportunities to send.");

    const subscribers = await fetchSubscribers();
    if (subscribers.length === 0) return console.log("No subscribers to send emails to.");

    const emailHtml = render(<OpportunitiesEmail opportunities={opportunities} />);

    // Send email to all subscribers
    await transporter.sendMail({
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: subscribers.join(","),
      subject: "🚀 Weekly Opportunities Digest",
      html: emailHtml,
    });

    console.log(`Emails sent to ${subscribers.length} subscribers.`);
  } catch (error) {
    console.error("Error sending weekly opportunities:", error);
  }
}

// Schedule to run every Saturday at 9 AM
cron.schedule("0 9 * * 6", sendWeeklyOpportunities);
