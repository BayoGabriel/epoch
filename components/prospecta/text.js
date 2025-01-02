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
      const uniqueCompanies = [...new Set(data.map((op) => op.companyName))];
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
        selectedCompany === "" || opportunity.companyName === selectedCompany;
      const matchesType =
        selectedType === "" || opportunity.type === selectedType;
      return matchesSearch && matchesCompany && matchesType;
    });
    setFilteredOpportunities(filtered);
  }, [searchQuery, selectedCompany, selectedType, opportunities]);

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
      <div className="w-full bg-[#F5F5F5] mt-[83px] max-lg:mt-[62px] flex items-center justify-center">
        <div className="flex flex-col w-full items-center justify-center lg:gap-[48px] gap-[36px] lg:py-[150px]">
          <div className="flex items-center w-full gap-[38px] flex-col max-lg:px-10 max-lg:pt-10 justify-center">
            <h2 className="h2 text-center">Discover and Seize Opportunities</h2>
            <p className="bt1 lg:w-[608px] text-center">
              Explore internships, scholarships, and more to gain experience,
              build your network, and accelerate your career journey.
            </p>
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
              <button className="absolute right-4 mr-2 max-lg:right-2 max-lg:mr-1 flex items-center justify-center bg-primary w-10 h-10 max-lg:w-5 max-lg:h-5 text-white rounded-full max-lg:text-[12px] text-[24px]">
                <CiSearch />
              </button>
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
                  className="appearance-none border noselect rounded-[8px] focus:outline-none border-[#DCDEE1] pl-6 pr-12 py-3 bt2 text-[#403D39CC]"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Opportunity Type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-[16px] flex items-center pointer-events-none text-[#403D39CC]">
                  <IoChevronDownOutline />
                </span>
              </div>
              <button
                className="text-[#3777FF] border rounded-[8px] focus:outline-none border-[#DCDEE1] px-6 py-3 bt2 bg-white"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCompany("");
                  setSelectedType("");
                }}
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Remaining components for displaying filtered opportunities */}
    </>
  );
};

export default Hero;
