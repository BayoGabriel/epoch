import React from 'react'

const DeadlineTracker = () => {
  return (
    <>
        <div className="w-full flex justify-center items-center lg:p-[120px] max-lg:p-6">
            <div className="w-full">
                <h3 className="h3 text-center lg:mb-6">Deadline Tracker</h3>
                <h4 className="h4 max-lg:text-center lg:mb-3">Filter by</h4>
                <div className="w-full">
                    <div className="w-full flex items-center gap-6 max-lg:hidden">
                        <select className="border focus:outline-none border-[#DCDEE1] px-6 py-3 bt2 text-[#403D39CC]">
                            <option value="">Company Name</option>
                        </select>
                        <select className="border focus:outline-none border-[#DCDEE1] px-6 py-3 bt2 text-[#403D39CC]">
                            <option value="">Opportunity Type</option>
                        </select>
                        <select className="border focus:outline-none border-[#DCDEE1] px-6 py-3 bt2 text-[#403D39CC]">
                            <option value="">Due Date</option>
                        </select>
                        <select className="border focus:outline-none border-[#DCDEE1] px-6 py-3 bt2 text-[#403D39CC]">
                            <option value="">Date Posted</option>
                        </select>
                     </div>
                    <div className="lg:hidden">
                        <div className="w-full flex justify-center gap-[12px] items-center">
                            <select className="border focus:outline-none text-[8px] border-[#DCDEE1] p-2 text-[#403D39CC]">
                            <option value="">Company Name</option>
                            </select>
                            <select className="border focus:outline-none text-[8px] border-[#DCDEE1] p-2 text-[#403D39CC]">
                                <option value="">Opportunity Type</option>
                            </select>
                            <select className="border focus:outline-none text-[8px] border-[#DCDEE1] p-2 text-[#403D39CC]">
                                <option value="">Due Date</option>
                            </select>
                        </div>
                        <div className="w-full flex justify-center gap-[12px] mt-[12px] items-center">
                            <select className="border focus:outline-none border-[#DCDEE1] p-2 text-[8px] text-[#403D39CC]">
                                <option value="">Date Posted</option>
                            </select>
                            <button className="text-[#3777FF] border focus:outline-none border-[#DCDEE1] p-2 text-[8px] bg-white">Reset Filter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DeadlineTracker