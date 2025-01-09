import connectMongo from "@/utils/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectMongo();

      const { opportunityId, status } = req.body;
      const userId = req.query.userId; // Extract user ID from session or query

      if (!userId || !opportunityId || !status) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Handle applied and tracking
      if (status === "applied") {
        if (!user.appliedOpportunities.includes(opportunityId)) {
          user.appliedOpportunities.push(opportunityId);
        }
      } else if (status === "tracking") {
        if (!user.trackedOpportunities.includes(opportunityId)) {
          user.trackedOpportunities.push(opportunityId);
        }
      } else {
        return res.status(400).json({ message: "Invalid status" });
      }

      await user.save();

      return res.status(200).json({ message: `Opportunity marked as ${status}`, status });
    } catch (error) {
      console.error("Error interacting with opportunity:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }
}
