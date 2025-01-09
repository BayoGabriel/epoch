"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  differenceInWeeks, 
  differenceInDays, 
  differenceInHours, 
  differenceInMinutes, 
  parseISO 
} from "date-fns";
import opp from "@/public/opp.svg";
import { toast } from "react-toastify";

const OpportunityDetails = ({ params }) => {
  const { id } = params;
  const { data: session } = useSession();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInteractions, setUserInteractions] = useState([]);

  // Fetch opportunity details
  useEffect(() => {
    if (id) {
      const fetchOpportunityDetails = async () => {
        try {
          const response = await fetch(`/api/opportunities/individual?id=${id}`);
          if (!response.ok) throw new Error("Failed to fetch opportunity details");
          const data = await response.json();
          setOpportunity(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

      fetchOpportunityDetails();
    }
  }, [id]);

  // Fetch user interactions
  useEffect(() => {
    const fetchUserInteractions = async () => {
      if (session && id) {
        try {
          const response = await fetch(`/api/opportunities/interact?opportunityId=${id}`);
          if (response.ok) {
            const interactions = await response.json();
            setUserInteractions(interactions);
          }
        } catch (error) {
          console.error("Error fetching user interactions:", error);
        }
      }
    };

    fetchUserInteractions();
  }, [session, id]);

  const handleInteraction = async (status) => {
    if (!session) {
      toast.error("Please log in to interact with this opportunity");
      return;
    }

    try {
      const response = await fetch("/api/opportunities/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: id, status }),
      });

      if (response.ok) {
        const interaction = await response.json();
        setUserInteractions((prev) =>
          [...prev.filter((inter) => inter.status !== status), interaction]
        );
        toast.success(`Opportunity marked as ${status}`);
      } else {
        toast.error(`Failed to mark as ${status}`);
      }
    } catch (error) {
      console.error("Error interacting with opportunity:", error);
      toast.error("An error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!opportunity) return <div>Opportunity not found.</div>;

  const timeAgo = (() => {
    const postedDate = parseISO(opportunity.dateCreated);
    const now = new Date();
    const weeksAgo = differenceInWeeks(now, postedDate);
    const daysAgo = differenceInDays(now, postedDate);
    const hoursAgo = differenceInHours(now, postedDate);
    const minutesAgo = differenceInMinutes(now, postedDate);

    if (weeksAgo > 0) return `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
    if (daysAgo > 0) return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    if (hoursAgo > 0) return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  })();

  const isApplied = userInteractions.some((inter) => inter.status === "applied");
  const isTracking = userInteractions.some((inter) => inter.status === "tracking");

  return (
    <div className="opportunity-details">
      <div className="opportunity-header">
        <h1>{opportunity.title}</h1>
        <p>{opportunity.type}</p>
        <span>Posted {timeAgo}</span>
        <div>
          <button
            onClick={() => handleInteraction("applied")}
            className={isApplied ? "btn-applied" : "btn-default"}
          >
            {isApplied ? "Applied ✓" : "Mark as Applied"}
          </button>
          <button
            onClick={() => handleInteraction("tracking")}
            className={isTracking ? "btn-tracking" : "btn-default"}
          >
            {isTracking ? "Tracking ✓" : "Track Opportunity"}
          </button>
        </div>
      </div>
      <Image src={opp} alt="Opportunity Image" />
    </div>
  );
};

export default OpportunityDetails;
