"use client"
import { useState } from 'react';
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";


const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-item border pt-[30px] px-[30px] max-lg:px-[10px] rounded-lg">
            <button
                className="flex items-center justify-between mb-[10px] lg:mb-[30px] w-full text-left"
                onClick={toggleAccordion}
            >
                <span className="h4">{title}</span>
                <span className="">
                    {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
            </button>
            {isOpen && (
                <div className="bt2 pb-4">
                    {content}
                </div>
            )}
        </div>
    );
};

export default Accordion;
