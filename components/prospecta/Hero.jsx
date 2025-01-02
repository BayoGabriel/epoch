"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import opp from "@/public/opp.svg";
import { IoChevronDownOutline } from "react-icons/io5";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

const Hero = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [selectedPostedDate, setSelectedPostedDate] = useState("");
  const [companies, setCompanies] = useState([]);
  const [types, setTypes] = useState([]);


  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/opportunities/main?range=all`);
      if (!response.ok) {
        throw new Error("Failed to fetch opportunities");
      }
      const data = await response.json();
      setOpportunities(data);
      setFilteredOpportunities(data);

      // Extract unique companies and types for the selects
      const uniqueCompanies = [...new Set(data.map((op) => op.title))];
      const uniqueTypes = [...new Set(data.map((op) => op.type))];
      setCompanies(uniqueCompanies);
      setTypes(uniqueTypes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Filter opportunities based on the search query and selects
  useEffect(() => {
    const filtered = opportunities.filter((opportunity) => {
      const matchesSearch = opportunity.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCompany =
        selectedCompany === "" || opportunity.title === selectedCompany;
      const matchesType =
        selectedType === "" || opportunity.type === selectedType;
  
      // Filter by Due Date
      const now = new Date();
      const dueDateMatch =
        selectedDueDate === "" ||
        (selectedDueDate === "this-week" &&
          new Date(opportunity.applicationDeadline) <=
            new Date(now.setDate(now.getDate() + 7))) ||
        (selectedDueDate === "this-month" &&
          new Date(opportunity.applicationDeadline) <=
            new Date(now.setMonth(now.getMonth() + 1)));
  
      // Filter by Date Posted
      const postedDateMatch =
        selectedPostedDate === "" ||
        (selectedPostedDate === "this-week" &&
          new Date(opportunity.dateCreated) >=
            new Date(now.setDate(now.getDate() - 7))) ||
        (selectedPostedDate === "this-month" &&
          new Date(opportunity.dateCreated) >=
            new Date(now.setMonth(now.getMonth() - 1)));
  
      return matchesSearch && matchesCompany && matchesType && dueDateMatch && postedDateMatch;
    });
    setFilteredOpportunities(filtered);
  }, [searchQuery, selectedCompany, selectedType, selectedDueDate, selectedPostedDate, opportunities]);  
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCompany("");
    setSelectedType("");
    setSelectedPostedDate("");
    setSelectedDueDate("");
  };  
  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
  const currentItems = filteredOpportunities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className='w-full bg-[#F5F5F5] mt-[83px] max-lg:mt-[62px] flex items-center justify-center'>
        <div className="flex flex-col w-full items-center justify-center lg:gap-[48px] gap-[36px] lg:py-[150px]">
          <div className="flex items-center w-full gap-[38px] flex-col max-lg:px-10 max-lg:pt-10 justify-center">
            <h2 className="h2 text-center">Discover and Seize Opportunities</h2>
            <p className="bt1 lg:w-[608px] text-center">Explore internships, scholarships, and more to gain experience, build your network, and accelerate your career journey.</p>
          </div>
          <div className="flex items-center flex-col w-full gap-[32px] lg:px-40 max-lg:pb-10 max-lg:gap-[16px] justify-center">
            <div className="flex relative items-center">
              <input
                type="text"
                placeholder="Search for an opportunity"
                className="px-8 max-lg:px-4 max-lg:py-2 py-3 max-lg:rounded-[16px] lg:rounded-[32px] lg:w-[560px] w-[327px] h-9 lg:h-[64px] appearance-none block border border-[#DCDEE1] max-lg:placeholder:text-[12px] placeholder-gray-500 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-4 mr-2 max-lg:right-2 max-lg:mr-1 flex items-center justify-center bg-primary w-10 h-10 max-lg:w-5 max-lg:h-5 text-white rounded-full max-lg:text-[12px] text-[24px]"><CiSearch /></button>
            </div>
            <div className="w-full flex items-center justify-evenly max-lg:hidden">
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
                className="appearance-none border noselect rounded-[8px] capitalize focus:outline-none border-[#DCDEE1] pl-6 pr-12 py-3 bt2 text-[#403D39CC]">
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
              <button onClick={resetFilters} className="text-[#3777FF] border rounded-[8px] focus:outline-none border-[#DCDEE1] px-6 py-3 bt2 bg-white">
                Reset Filter
              </button>
            </div>
            <div className="lg:hidden">
                <div className="w-full flex justify-center gap-[12px] items-center">
                    <select value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)} className="border focus:outline-none text-[8px] border-[#DCDEE1] p-2 text-[#403D39CC]">
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
                      className="border focus:outline-none text-[8px] border-[#DCDEE1] p-2 text-[#403D39CC]">
                        <option value="">Opportunity Type</option>
                        {types.map((type) => (
                          <option className="capitalize" key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>
                    <select className="border focus:outline-none text-[8px] border-[#DCDEE1] p-2 text-[#403D39CC]"
                      value={selectedDueDate}
                      onChange={(e) => setSelectedDueDate(e.target.value)}
                    >
                        <option value="">Due Date</option>
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                        <option value="">All Time</option>
                    </select>
                </div>
                <div className="w-full flex justify-center gap-[12px] mt-[12px] items-center">
                    <select className="border focus:outline-none border-[#DCDEE1] p-2 text-[8px] text-[#403D39CC]"
                      value={selectedPostedDate}
                      onChange={(e) => setSelectedPostedDate(e.target.value)}
                    >
                        <option value="">Date Posted</option>
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                        <option value="">All Time</option>
                    </select>
                    <button onClick={resetFilters} className="text-[#3777FF] border focus:outline-none border-[#DCDEE1] p-2 text-[8px] bg-white">Reset Filter</button>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:p-[120px] max-lg:p-6">
        <div className="w-full mb-5 flex items-center justify-between max-lg:hidden">
          <h4 className="h4 text-black">Company Name</h4>
          <h4 className="h4 text-black">Opportunity Name</h4>
          <h4 className="h4 text-black">Description</h4>
          <div className=""></div>
        </div>
        <div className="flex max-lg:hidden flex-col gap-8 w-full">
          {currentItems.length === 0 ? (
            <p>No opportunities available.</p>
          ) : (
            currentItems.map((opportunity) => (
              <div
                key={opportunity._id}
                className="oppcard px-5 py-[10px] gap-8 flex lg:justify-between max-lg:flex-col items-center"
              >
                <div className="flex-shrink-0">
                  <Image src={opp} alt="image" className="w-20 h-auto" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <h3 className="h4 capitalize">{opportunity.title}</h3>
                  <p className="bt1 capitalize">{opportunity.type}</p>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <h3 className="h4 capitalize text-accent">Position: {opportunity.position}</h3>
                  <p className="bt2 capitalize">
                    Deadline: {format(new Date(opportunity.applicationDeadline), "MMM do, yyyy")}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="">{opportunity.description}</p>
                </div>
                <div className="flex-shrink-0 py-4">
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
        <div className="flex lg:hidden flex-col gap-8">
        {currentItems.length === 0 ? (
          <p>No opportunities available.</p>
        ) : (
          currentItems.map((opportunity) => (
            <div
              key={opportunity._id}
              className="oppcard px-5 py-[10px] flex lg:justify-between max-lg:flex-col items-center gap-8"
            >
              <div className="w-full flex items-center gap-4">
              <div className="flex-shrink-0">
                <Image src={opp} alt="image" className="w-20 h-auto" />
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <h3 className="h4 capitalize">{opportunity.title}</h3>
                <p className="bt1 capitalize">{opportunity.type}</p>
              </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <h3 className="h4 capitalize text-accent">Position: {opportunity.position}</h3>
                <p className="bt2 capitalize">
                  Deadline: {format(new Date(opportunity.applicationDeadline), "MMM do, yyyy")}
                </p>
              </div>
              <div className="flex-shrink-0 w-full py-4">
                <Link
                  href={opportunity.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#DCDEE1] rounded-[8px] px-[15px] py-[6px] oppbtn text-[14px] font-[400]"
                >
                  Apply
                </Link>
              </div>
            </div>
          ))
        )}
        </div>
        <div className="flex w-full justify-center mt-8 gap-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border ${
                page === currentPage ? "bg-primary text-white" : "bg-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;