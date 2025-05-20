//components/prospecta/DeadlineTracker.jsx
'use client';

import { useState, useEffect } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import opp from "@/public/opp.svg";
import { IoChevronDownOutline } from "react-icons/io5";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../shared/LoadingSpinner";

const DeadlineTracker = () => {
  const { data: session } = useSession();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [selectedPostedDate, setSelectedPostedDate] = useState("");
  const [companies, setCompanies] = useState([]);
  const [types, setTypes] = useState([]);

  // Fetch user's opportunities
  useEffect(() => {
    const fetchUserOpportunities = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/opportunities/user?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        const data = await response.json();
        
        // Combine both tracked and applied opportunities
        const allOpportunities = [...(data.applied || []), ...(data.tracking || [])];
        
        // Sort opportunities by deadline
        const sortedOpportunities = allOpportunities.sort((a, b) => {
          const dateA = parseISO(a.applicationDeadline);
          const dateB = parseISO(b.applicationDeadline);
          return dateA - dateB;
        });

        setOpportunities(sortedOpportunities);
        setFilteredOpportunities(sortedOpportunities);

        // Extract unique companies and types
        const uniqueCompanies = [...new Set(sortedOpportunities.map((op) => op.institution))];
        const uniqueTypes = [...new Set(sortedOpportunities.map((op) => op.type))];
        setCompanies(uniqueCompanies);
        setTypes(uniqueTypes);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load your opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOpportunities();
  }, [session]);

  // Filter opportunities based on selects
  useEffect(() => {
    if (!opportunities.length) return;

    const filtered = opportunities.filter((opportunity) => {
      const matchesCompany =
        selectedCompany === "" || opportunity.institution === selectedCompany;
      const matchesType =
        selectedType === "" || opportunity.type === selectedType;
  
      // Filter by Due Date
      const now = new Date("2025-01-13T21:53:40+01:00");
      const deadlineDate = parseISO(opportunity.applicationDeadline);
      const daysUntilDeadline = differenceInDays(deadlineDate, now);
      
      const dueDateMatch =
        selectedDueDate === "" ||
        (selectedDueDate === "this-week" && daysUntilDeadline >= 0 && daysUntilDeadline <= 7) ||
        (selectedDueDate === "this-month" && daysUntilDeadline >= 0 && daysUntilDeadline <= 30);
  
      // Filter by Date Posted
      const postedDate = parseISO(opportunity.dateCreated);
      const daysSincePosted = differenceInDays(now, postedDate);
      
      const postedDateMatch =
        selectedPostedDate === "" ||
        (selectedPostedDate === "this-week" && daysSincePosted >= 0 && daysSincePosted <= 7) ||
        (selectedPostedDate === "this-month" && daysSincePosted >= 0 && daysSincePosted <= 30);
  
      return matchesCompany && matchesType && dueDateMatch && postedDateMatch;
    });

    setFilteredOpportunities(filtered);
  }, [selectedCompany, selectedType, selectedDueDate, selectedPostedDate, opportunities]);

  const resetFilters = () => {
    setSelectedCompany("");
    setSelectedType("");
    setSelectedPostedDate("");
    setSelectedDueDate("");
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="w-full flex justify-center items-center lg:p-[120px] max-lg:py-6 max-lg:px-2">
        <div className="w-full max-w-7xl">
          <h3 className="h3 text-center lg:mb-6">Deadline Tracker</h3>
          <p className="text-center text-gray-600 mb-8">
            Track all your opportunities ({opportunities.length})
          </p>

          <h4 className="h4 max-lg:text-center mb-3">Filter by</h4>
          <div className="w-full">
            {/* Desktop Filters */}
            <div className="w-full flex items-center gap-6 max-lg:hidden">
              <div className="relative w-fit">
                <select
                  className="appearance-none border noselect rounded-[8px] focus:outline-none border-[#DCDEE1] pl-6 pr-12 py-3 bt2 text-[#403D39CC]"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="">Company Name</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-[16px] flex items-center pointer-events-none text-[#403D39CC]">
                  <IoChevronDownOutline />
                </span>
              </div>
              <div className="relative w-fit">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none border noselect rounded-[8px] capitalize focus:outline-none border-[#DCDEE1] pl-6 pr-12 py-3 bt2 text-[#403D39CC]"
                >
                  <option value="">Opportunity Type</option>
                  {types.map((type) => (
                    <option className="capitalize" key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-[16px] flex items-center pointer-events-none text-[#403D39CC]">
                  <IoChevronDownOutline />
                </span>
              </div>
              <div className="relative w-fit">
                <select
                  className="appearance-none border noselect rounded-[8px] focus:outline-none border-[#DCDEE1] pl-6 pr-12 py-3 bt2 text-[#403D39CC]"
                  value={selectedDueDate}
                  onChange={(e) => setSelectedDueDate(e.target.value)}
                >
                  <option value="">Due Date</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="">All Time</option>
                </select>
                <span className="absolute inset-y-0 right-[16px] flex items-center pointer-events-none text-[#403D39CC]">
                  <IoChevronDownOutline />
                </span>
              </div>
              <div className="relative w-fit">
                <select
                  className="appearance-none border noselect rounded-[8px] focus:outline-none border-[#DCDEE1] pl-6 pr-12 py-3 bt2 text-[#403D39CC]"
                  value={selectedPostedDate}
                  onChange={(e) => setSelectedPostedDate(e.target.value)}
                >
                  <option value="">Date Posted</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="">All Time</option>
                </select>
                <span className="absolute inset-y-0 right-[16px] flex items-center pointer-events-none text-[#403D39CC]">
                  <IoChevronDownOutline />
                </span>
              </div>
              <button onClick={resetFilters} className="text-[#3777FF] border rounded-[8px] focus:outline-none border-[#DCDEE1] px-6 py-3 bt2 bg-white hover:bg-gray-50 transition-colors duration-200">
                Reset Filter
              </button>
            </div>

            {/* Mobile Filters */}
            <div className="lg:hidden">
              <div className="w-full flex justify-center gap-[12px] items-center">
                <select 
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="border focus:outline-none text-[10px] border-[#DCDEE1] p-2 rounded-md text-[#403D39CC]"
                >
                  <option value="">Company Name</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border focus:outline-none text-[10px] border-[#DCDEE1] p-2 rounded-md text-[#403D39CC]"
                >
                  <option value="">Opportunity Type</option>
                  {types.map((type) => (
                    <option className="capitalize" key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full flex justify-center gap-[12px] mt-[12px] items-center">
                <select
                  value={selectedDueDate}
                  onChange={(e) => setSelectedDueDate(e.target.value)}
                  className="border focus:outline-none text-[10px] border-[#DCDEE1] p-2 rounded-md text-[#403D39CC]"
                >
                  <option value="">Due Date</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="">All Time</option>
                </select>
                <select
                  value={selectedPostedDate}
                  onChange={(e) => setSelectedPostedDate(e.target.value)}
                  className="border focus:outline-none border-[#DCDEE1] p-2 text-[10px] rounded-md text-[#403D39CC]"
                >
                  <option value="">Date Posted</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="">All Time</option>
                </select>
                
              </div>
              <div className="w-full mt-[12px] flex items-center justify-center">
                <button onClick={resetFilters} className="text-[#3777FF] border focus:outline-none border-[#DCDEE1] p-2 text-[10px] rounded-md bg-white hover:bg-gray-50 transition-colors duration-200">
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Opportunities List */}
          <div className="mt-8">
            {loading ? (
              <div className="text-center py-10">
                <LoadingSpinner/>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No opportunities found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => {
                  const deadlineDate = parseISO(opportunity.applicationDeadline);
                  const now = new Date("2025-01-13T21:53:40+01:00");
                  const daysUntilDeadline = differenceInDays(deadlineDate, now);

                  return (
                    <div
                      key={opportunity._id}
                      className="bg-white shadow-md rounded-lg p-6 flex max-lg:flex-col lg:justify-between lg:items-center gap-4 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex max-lg:flex-col lg:items-center gap-4">
                        <div className="flex-shrink-0">
                          <Image 
                            src={opportunity.imageUrl || opp} 
                            alt={opportunity.title} 
                            width={80} 
                            height={80} 
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="h4 text-accent">{opportunity.institution}</h3>
                          <p className="text-gray-600 bt2 capitalize">{opportunity.type}</p>
                          <p className="text-gray-600 bt2 capitalize">Position: {opportunity.position}</p>
                          <p className="bt2 text-gray-500">
                            Deadline: {format(deadlineDate, "MMM do, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex lg:flex-col lg:items-end gap-2 max-lg:justify-between">
                        <div className={`bt2 ${
                          daysUntilDeadline < 0 
                            ? 'text-red-600'
                            : daysUntilDeadline <= 7
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                          {daysUntilDeadline < 0
                            ? 'Deadline passed'
                            : daysUntilDeadline === 0
                            ? 'Due today'
                            : `${daysUntilDeadline} days left`}
                        </div>
                        <Link 
                          href={`/prospecta/${opportunity._id}`}
                          className="text-primary hover:text-primary bt2 transition-colors duration-200"
                        >
                          View Opportunity
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeadlineTracker;