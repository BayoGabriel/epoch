"use client";
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import Link from 'next/link';
import { MdNavigateNext } from 'react-icons/md';
import Image from 'next/image';
import opp from "@/public/opp.svg";

const NewOpportunity = () => {
  const [toggle, setToggle] = useState(1);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleTab = (index) => {
    setToggle(index);
  };

  const fetchOpportunities = async (days) => {
    try {
      setLoading(true);

      let url = '/api/opportunities/main';
      if (days !== null) {
        url += `?week=${days}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }
      const data = await response.json();
      setOpportunities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let days;

    // Determine the number of days to filter based on the toggle value
    switch (toggle) {
      case 1: // This Week (Past 7 Days)
        days = 7;
        break;
      case 2: // This Month (Past 28 Days)
        days = 28;
        break;
      case 3: // All Time (No filtering by date)
        days = null;
        break;
      default:
        days = 7;
    }

    fetchOpportunities(days);
  }, [toggle]);

  if (loading) {
    return <p>Loading opportunities...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full flex-col items-center justify-center max-lg:py-[40px] max-lg:px-4 px-[80px] py-[140px]">
      <h2 className="h2 text-black text-center">New Opportunities</h2>
      <div className="w-full flex items-center justify-between mt-2 mb-[30px]">
        <div className="flex items-center max-lg:justify-center max-lg:w-full gap-[10px]">
          {['This Week', 'This Month', 'All Time'].map((label, index) => (
            <button
              key={label}
              onClick={() => toggleTab(index + 1)}
              className={`b1 ${toggle === index + 1 ? 'border-b border-b-black' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
        <Link href='/prospecta' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
          <span className=''>View More Opportunity</span>
          <MdNavigateNext className='mt-1'/>
        </Link>
      </div>

      <div className="opportunity-list">
        {opportunities.length === 0 ? (
          <p>No opportunities available.</p>
        ) : (
          opportunities.map((opportunity) => (
            <div key={opportunity._id} className="">
              <h3 className="text-xl font-bold">{opportunity.title}</h3>
              <p className="mt-2">{opportunity.description}</p>
              <p className="mt-2 font-semibold">Type: {opportunity.type}</p>
              <p className="mt-2 font-semibold">
                Institution: {opportunity.institution}
              </p>
              <p className="mt-2">
                Deadline: {format(new Date(opportunity.applicationDeadline), "MMM do, yyyy")}
              </p>
              {opportunity.imageUrl && (
                <Image src={opp} alt={opportunity.title} className="mt-4 max-w-full h-auto rounded" />
              )}
              <a
                href={opportunity.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded"
              >
                Apply Now
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewOpportunity;
