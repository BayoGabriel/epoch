// "use client";
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// const Hero = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/'); 
//     }
//   }, [status, router]);

//   if (!session) {
//     return null;
//   }

//   return (
//     <div className='w-full bg-[#F5F5F5] flex mt-[95px] max-lg:mt-[62px] flex-col p-0 h-screen items-center justify-center'>
//       {/* <h1>Welcome, {session.user.username}!</h1> */}
//       {/* <p>Last Name: {session.user.school}</p>
//       <p>Email: {session.user.email}</p>
//       <p>ID: {session.user.id}</p>
//       <p>ID: {session.user.password}</p>
//       <p>Role: {session.user.role}</p>
//       <Link href="/dashboard/pros">Opps</Link> */}
//       <div className="text-black h2">
//         Personalized Dashboard coming soon!!!
//       </div>
//       <h3 className="h3">
//         For now, enjoy all available features for <span className="text-primary">FREE</span>
//       </h3>

//     </div>
//   );
// };

// export default Hero;
"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  differenceInDays, 
  format, 
  parseISO 
} from 'date-fns';

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
        const response = await fetch('/api/userdb');
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        const data = await response.json();
        setOpportunities(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setLoading(false);
      }
    };

    fetchUserOpportunities();
  }, [session]);

  // Remove interaction handler
  const handleRemoveInteraction = async (opportunityId, status) => {
    try {
      const response = await fetch('/api/opportunities/interact', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          opportunityId, 
          status 
        }),
      });

      if (response.ok) {
        // Remove the opportunity from the local state
        setOpportunities(prev => ({
          ...prev,
          [status]: prev[status].filter(opp => opp._id !== opportunityId)
        }));
      } else {
        throw new Error('Failed to remove interaction');
      }
    } catch (error) {
      console.error('Error removing interaction:', error);
      alert('Failed to remove the opportunity');
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
          <div>
            <Link 
              href={`/prospecta/${opportunity._id}`} 
              className="text-xl font-bold hover:text-blue-600"
            >
              {opportunity.title}
            </Link>
            <div className="text-sm text-gray-600 mt-2">
              <p>{opportunity.institution}</p>
              <p className="mt-1">
                Deadline: {format(deadlineDate, 'MMMM dd, yyyy')} 
                {daysRemaining > 0 && ` (${daysRemaining} days remaining)`}
                {daysRemaining <= 0 && ` (Expired)`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'applied' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {status === 'applied' ? 'Applied' : 'Tracking'}
            </span>
            <button 
              onClick={() => handleRemoveInteraction(opportunity._id, status)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      );
    });
  };

  // If not logged in
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please log in to view your dashboard</p>
          <Link href="/login" className="primarybtn">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading opportunities...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Opportunities</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => setActiveTab('applied')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'applied' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Applied Opportunities
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'tracking' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tracked Opportunities
          </button>
        </nav>
      </div>

      {/* Opportunities List */}
      <div>
        {activeTab === 'applied' 
          ? renderOpportunityList(opportunities.applied, 'applied')
          : renderOpportunityList(opportunities.tracking, 'tracking')
        }
      </div>
    </div>
  );
};

export default Hero;