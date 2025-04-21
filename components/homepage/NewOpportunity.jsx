"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdNavigateNext } from 'react-icons/md';
import Image from 'next/image';
import oppImage from "@/public/opp.svg";
import { format } from 'date-fns';

const NewOpportunity = () => {
  const [toggle, setToggle] = useState(1);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleTab = (index) => {
    setToggle(index);
  };

  const fetchOpportunities = async (range) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/opportunities/main?range=${range}`);
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
    let range;

    // Determine the range to fetch based on the selected toggle
    switch (toggle) {
      case 1:
        range = 'week'; // This Week
        break;
      case 2:
        range = 'month'; // This Month
        break;
      case 3:
        range = 'all'; // All Time
        break;
      default:
        range = 'week';
    }

    fetchOpportunities(range);
  }, [toggle]);

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

      <div className="flex lg:hidden flex-col gap-8">
        {opportunities.length === 0 ? (
          <p>No opportunities available.</p>
        ) : (
          opportunities.slice(0,3).map((opportunity) => (
            <div
              key={opportunity._id}
              className="oppcard px-5 py-[10px] flex lg:justify-between max-lg:flex-col items-center gap-8"
            >
              <div className="w-full flex items-center gap-4">
              <div className="flex-shrink-0">
                <Image 
                  src={opportunity.imageUrl || oppImage } 
                  alt='Opportunity'
                  width={80} 
                  height={80} 
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <h3 className="h4 capitalize">{opportunity.institution}</h3>
                <p className="bt1 capitalize">{opportunity.type}</p>
              </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <h3 className="h4 capitalize text-accent">Position: {opportunity.position}</h3>
                <p className="bt2 capitalize">
                  Deadline: {format(new Date(opportunity.applicationDeadline), "MMM do, yyyy")}
                </p>
              </div>
              <div className="w-full">
                <div
                    className="text-gray-700 bt2"
                    dangerouslySetInnerHTML={{ __html: opportunity.description.slice(0, 40) + "..." }}
                  />
              </div>
              <div className="flex-shrink-0 w-full py-4">
                <Link
                  href={`/prospecta/${opportunity._id}`}
                  rel="noopener noreferrer"
                  className="border border-[#DCDEE1] rounded-[8px] px-[15px] py-[6px] oppbtn text-[14px] font-[400]"
                >
                  View Opportunity
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex max-lg:hidden flex-col gap-8">
        {opportunities.length === 0 ? (
          <p>No opportunities available.</p>
        ) : (
          opportunities.slice(0,3).map((opportunity) => (
            <div
              key={opportunity._id}
              className="oppcard px-5 py-[10px] flex lg:justify-between max-lg:flex-col items-center gap-8"
            >
              {/* Image Section */}
              <div className="flex-shrink-0">
              <Image 
                src={opportunity.imageUrl || oppImage } 
                alt={opportunity.title || 'Opportunity'} 
                width={50} 
                height={50} 
                className="w-20 h-auto"
              />
              </div>

              {/* Title and Type */}
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="h4 capitalize">{opportunity.institution}</h3>
                <p className="bt1 capitalize">{opportunity.type}</p>
              </div>

              {/* Position and Deadline */}
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="h4 capitalize text-accent">Position: {opportunity.position}</h3>
                <p className="bt2 capitalize">
                  Deadline: {format(new Date(opportunity.applicationDeadline), "MMM do, yyyy")}
                </p>
              </div>

              {/* Description */}
              <div className="flex-1">
                <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: opportunity.description.slice(0, 30) }}
                  />
              </div>

              {/* Apply Button */}
              <div className="flex-shrink-0 py-4">
                <Link
                  href={`/prospecta/${opportunity._id}`}
                  className="border border-[#DCDEE1] rounded-[8px] px-[15px] py-[6px] oppbtn text-[14px] font-[400]"
                >
                  View Opportunity
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewOpportunity;
