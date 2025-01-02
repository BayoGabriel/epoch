"use client"
import { useState } from 'react';
import up from '@/public/up.svg'
import down from '@/public/down.svg'
import Image from 'next/image';

const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-item border pt-[30px] px-[30px] rounded-lg">
            <button
                className="flex items-center justify-between  mb-[30px] w-full text-left"
                onClick={toggleAccordion}
            >
                <span className="h4">{title}</span>
                <span className="">
                    {isOpen ? <Image src={up} alt='icon'/> : <Image src={down} alt='icon'/>}
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
