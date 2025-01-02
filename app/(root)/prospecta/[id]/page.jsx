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
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

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
          if (!response.ok) {
            throw new Error("Failed to fetch opportunity details");
          }
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

  // Fetch user interactions for this opportunity
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
          console.error('Error fetching user interactions:', error);
        }
      }
    };

    fetchUserInteractions();
  }, [session, id]);

  // Handle opportunity interaction (applied/tracking)
  const handleInteraction = async (status) => {
    if (!session) {
      toast.error("Please log in to interact with this opportunity");
      return;
    }

    try {
      const response = await fetch('/api/opportunities/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          opportunityId: id, 
          status 
        }),
      });

      if (response.ok) {
        const interaction = await response.json();
        
        // Update local state
        setUserInteractions(prev => {
          // Remove previous interactions of the same type
          const filteredInteractions = prev.filter(
            inter => inter.status !== status
          );
          return [...filteredInteractions, interaction];
        });

        toast.success(`Opportunity marked as ${status}`);
      } else {
        toast.error(`Failed to mark as ${status}`);
      }
    } catch (error) {
      console.error('Error interacting with opportunity:', error);
      toast.error('An error occurred');
    }
  };

  // Time calculation logic (same as before)
  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!opportunity) {
    return <div>Opportunity not found.</div>;
  }

  const postedDate = parseISO(opportunity.dateCreated);
  const now = new Date();

  const weeksAgo = differenceInWeeks(now, postedDate);
  const daysAgo = differenceInDays(now, postedDate);
  const hoursAgo = differenceInHours(now, postedDate);
  const minutesAgo = differenceInMinutes(now, postedDate);

  let timeAgo = "";

  if (weeksAgo > 0) {
    timeAgo = `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
  } else if (daysAgo > 0) {
    timeAgo = `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  } else if (hoursAgo > 0) {
    timeAgo = `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  } else if (minutesAgo > 0) {
    timeAgo = `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  } else {
    timeAgo = "Just now";
  }

  // Check if user has already applied or is tracking
  const isApplied = userInteractions.some(
    interaction => interaction.status === 'applied'
  );
  const isTracking = userInteractions.some(
    interaction => interaction.status === 'tracking'
  );

  return (
    <>
      {session ? (
        <div className="w-full mt-[83px] max-lg:mt-[62px] flex items-center justify-center">
          <div className="w-full bg-white p-[120px] shadow-lg flex items-center justify-between">
            <div className="flex flex-col gap-5">
              <h1 className="h2 text-black">{opportunity.title}</h1>
              <h3 className="h3 capitalize text-[#403D39CC]">{opportunity.type}</h3>
              <div className="flex gap-4 items-center">
                <span className="text-white py-[6px] px-[15px] rounded-[8px] shadow-sm bg-accent">
                  Posted {timeAgo}
                </span>
                
                {/* Interaction Buttons */}
                <button 
                  onClick={() => handleInteraction('applied')}
                  className={`py-2 px-4 rounded-md ${
                    isApplied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                  }`}
                >
                  {isApplied ? 'Applied ✓' : 'Mark as Applied'}
                </button>
                
                <button 
                  onClick={() => handleInteraction('tracking')}
                  className={`py-2 px-4 rounded-md ${
                    isTracking 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {isTracking ? 'Tracking ✓' : 'Track Opportunity'}
                </button>
              </div>
            </div>
            <Image src={opp} alt="image" className="" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <span>You are not logged in!</span>
          <Link href="/" className="primarybtn">
            Go to Home page
          </Link>
        </div>
      )}
    </>
  );
};

export default OpportunityDetails;