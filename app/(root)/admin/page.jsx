'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import opp from '@/public/opp.svg';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Debug session
  useEffect(() => {
    console.log('Session:', session);
    console.log('Status:', status);
    console.log('User role:', session?.user?.role);
  }, [session, status]);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (status === 'loading') return;
      
      if (!session?.user?.role || session.user.role !== 'admin') {
        console.log('Not admin, redirecting');
        router.push('/');
        return;
      }

      try {
        const response = await fetch('/api/opportunities/admin');
        if (!response.ok) throw new Error('Failed to fetch opportunities');
        const data = await response.json();
        setOpportunities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [session, status, router]);

  const handleEditOpportunity = (id) => {
    router.push(`/admin/opportunities/${id}`);
  };

  const handleDeleteOpportunity = async (id) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const response = await fetch(`/api/opportunities/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete opportunity');
      
      setOpportunities(opportunities.filter(opp => opp._id !== id));
    } catch (err) {
      console.error('Error deleting opportunity:', err);
      alert('Failed to delete opportunity');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/opportunities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setOpportunities(opportunities.map(opp => 
        opp._id === id ? { ...opp, status: newStatus } : opp
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (selectedStatus !== 'all' && opp.status !== selectedStatus) return false;
    if (selectedType !== 'all' && opp.type !== selectedType) return false;
    return true;
  });

  // Show loading state while checking session
  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div>Loading...</div>
        <div className="text-sm text-gray-500">Status: {status}</div>
      </div>
    );
  }

  // Redirect if not admin
  if (!session?.user?.role || session.user.role !== 'admin') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500">Access Denied</div>
        <div className="text-sm text-gray-500">
          Current role: {session?.user?.role || 'No role'}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[83px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => router.push('/prospecta')}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Create New Opportunity
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Types</option>
            <option value="internship">Internship</option>
            <option value="scholarship">Scholarship</option>
            <option value="job">Job</option>
            <option value="volunteer">Volunteer</option>
            <option value="ambassadorship">Ambassadorship</option>
            <option value="training">Training</option>
          </select>
        </div>

        {/* Opportunities List */}
        <div className="bg-white shadow rounded-lg">
          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 font-medium text-gray-700 border-b">
            <div>Opportunity</div>
            <div>Type</div>
            <div>Deadline</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No opportunities found
            </div>
          ) : (
            filteredOpportunities.map((opp) => (
              <div key={opp._id} className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 items-center border-b last:border-b-0 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Image
                    src={opp.imageUrl || opp}
                    alt={opp.title}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-medium">{opp.institution}</div>
                    <div className="text-sm text-gray-500">{opp.position}</div>
                  </div>
                </div>

                <div className="capitalize">{opp.type}</div>

                <div className="whitespace-nowrap">
                  {format(new Date(opp.applicationDeadline), "MMM d, yyyy")}
                </div>

                <select
                  value={opp.status}
                  onChange={(e) => handleStatusChange(opp._id, e.target.value)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    opp.status === 'approved' ? 'bg-green-100 text-green-800' :
                    opp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    opp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditOpportunity(opp._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteOpportunity(opp._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
