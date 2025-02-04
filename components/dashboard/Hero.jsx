"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { differenceInDays, format, parseISO } from 'date-fns';
import opp from "@/public/opp.svg";
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import { IoTimeOutline } from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';

const Hero = () => {
  const { data: session } = useSession();
  const [opportunities, setOpportunities] = useState({
    applied: [],
    tracking: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applied');
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch user's opportunities
  useEffect(() => {
    const fetchUserOpportunities = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/opportunities/user?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        const data = await response.json();
        setOpportunities(data);

        // Get recent activities (last 3 interactions)
        const allInteractions = [...(data.applied || []), ...(data.tracking || [])]
          .sort((a, b) => new Date(b.dateInteracted) - new Date(a.dateInteracted))
          .slice(0, 3);
        setRecentActivities(allInteractions);

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load your opportunities');
        setLoading(false);
      }
    };

    fetchUserOpportunities();
  }, [session]);

  // Handle removing an interaction
  const handleRemoveInteraction = async (opportunityId, status) => {
    try {
      const response = await fetch('/api/opportunities/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunityId,
          userId: session.user.id,
          status,
        }),
      });

      if (response.ok) {
        // Remove the opportunity from the local state
        setOpportunities(prev => ({
          ...prev,
          [status]: prev[status].filter(opp => opp._id !== opportunityId)
        }));
        toast.success(`Removed from ${status}`);
      } else {
        toast.error('Failed to remove opportunity');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  // Render opportunities list
  const renderOpportunityList = (opportunityList, status) => {
    if (!opportunityList || opportunityList.length === 0) {
      return <p className="text-gray-500">No opportunities found</p>;
    }

    return opportunityList.map((opportunity) => {
      if (!opportunity) return null;
      
      // Calculate days until application deadline
      try {
        const deadlineDate = opportunity.applicationDeadline ? parseISO(opportunity.applicationDeadline) : null;
        const daysUntilDeadline = deadlineDate ? differenceInDays(deadlineDate, new Date("2025-01-13T22:17:16+01:00")) : null;

        return (
          <div key={opportunity._id} className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{opportunity.institution}</h3>
              {daysUntilDeadline !== null && (
                <span className={`text-sm ${
                  daysUntilDeadline <= 7 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {daysUntilDeadline <= 0
                    ? 'Deadline passed'
                    : `${daysUntilDeadline} days left`}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 capitalize">{opportunity.type}</p>
            <p className="text-sm text-gray-600">Position: {opportunity.position}</p>
            {deadlineDate && (
              <p className="text-sm text-gray-600">
                Deadline: {format(deadlineDate, "MMM do, yyyy")}
              </p>
            )}
            <div className="flex justify-end mt-2">
              <Link
                href={`/prospecta/${opportunity._id}`}
                className="text-primary hover:text-primary/80 transition-colors duration-200"
              >
                View Details
              </Link>
              <button
                onClick={() => handleRemoveInteraction(opportunity._id, status)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                Remove
              </button>
            </div>
          </div>
        );
      } catch (error) {
        console.error('Error rendering opportunity:', error);
        return null;
      }
    }).filter(Boolean); // Remove null entries
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Please log in to view your dashboard</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Go to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen py-[95px] max-lg:pt-[62px] px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="h2 mb-8">
          Welcome, {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
        </h1>
        <h2 className="h4 mb-4">Upcoming Deadlines</h2>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'applied'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Applied ({opportunities.applied.length})
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'tracking'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Tracking ({opportunities.tracking.length})
          </button>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {renderOpportunityList(
            opportunities[activeTab],
            activeTab
          )}
        </div>

        {/* Recent Activities */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <BsClockHistory className="h4 text-gray-700" />
            <h2 className="h4 text-gray-900">Recent Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivities.map((activity) => (
              <div key={activity._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 flex-shrink-0">
                      <Image
                        src={activity.imageUrl || opp}
                        alt={activity.institution}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="bt2 text-gray-900">{activity.institution}</h3>
                      <p className="bt2 text-gray-500 capitalize">{activity.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center bt2 text-gray-500">
                      <IoTimeOutline className="mr-1" />
                      {format(parseISO(activity.dateInteracted), 'MMM do yyyy')}
                    </span>
                    <span className="`bt2 capitalize text-primary">
                      {activity.interactionStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;