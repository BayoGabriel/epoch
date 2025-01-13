"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { differenceInDays, format, parseISO } from 'date-fns';
import opp from "@/public/opp.svg";
import { toast } from 'react-toastify';

const Hero = () => {
  const { data: session } = useSession();
  const [opportunities, setOpportunities] = useState({
    applied: [],
    tracking: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applied');

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
    if (opportunityList.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          No {status} opportunities
        </div>
      );
    }

    return opportunityList.map((opportunity) => {
      // Calculate days until application deadline
      const deadlineDate = parseISO(opportunity.applicationDeadline);
      const daysRemaining = differenceInDays(deadlineDate, new Date());
      
      return (
        <div 
          key={opportunity._id} 
          className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image 
                src={opportunity.imageUrl || 'https://res.cloudinary.com/dq1uyidfy/image/upload/v1704993600/opportunities/default_opportunity.png'} 
                alt={opportunity.title} 
                width={80} 
                height={80} 
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">{opportunity.institution}</h3>
              <p className="text-gray-600 capitalize">{opportunity.type}</p>
              <p className="text-gray-600">Position: {opportunity.position}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm">
              {daysRemaining > 0 ? (
                <span className="text-green-600">{daysRemaining} days remaining</span>
              ) : (
                <span className="text-red-600">Deadline passed</span>
              )}
            </div>
            <Link 
              href={`/prospecta/${opportunity._id}`}
              className="text-blue-600 hover:underline"
            >
              View Details
            </Link>
            <button
              onClick={() => handleRemoveInteraction(opportunity._id, status)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
      );
    });
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

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen pt-[95px] max-lg:pt-[62px] px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Opportunities</h1>
        
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

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          /* Opportunities List */
          <div className="space-y-4">
            {renderOpportunityList(
              opportunities[activeTab],
              activeTab
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;