/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import amba from '@/public/amba.png'
import ambam from '@/public/ambam.png'
import reach from '@/public/reach.png'
import reachm from '@/public/reachm.png'
import reach2 from '@/public/reach2.png'
import reach2m from '@/public/reach2m.png'
import ambi from '@/public/ambi.svg'
import bulb from '@/public/bulb.svg'
import world from '@/public/world.svg'
import amb1 from '@/public/amb3.svg'
import amb2 from '@/public/amb4.svg'
import amb5 from '@/public/amb5.svg'
import amb6 from '@/public/amb6.svg'
import Link from 'next/link'
import { IoBulbOutline } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';
import lead from '@/public/lead.png';
import lead1 from '@/public/lead1.png';
import ambim from '@/public/ambim.png';
import lead2 from '@/public/lead2.png';
import school1 from '@/public/school1.png';
import school2 from '@/public/school2.png';
import school3 from '@/public/school3.png';
import school4 from '@/public/school4.png';
import school5 from '@/public/school5.png';
import school6 from '@/public/school6.png';
import school7 from '@/public/school7.png';
import school8 from '@/public/school8.png';
import school9 from '@/public/school9.png';
import school10 from '@/public/school10.png';
import school11 from '@/public/school11.png';

const cardsData = [
  {
    id: 1,
    image: lead,
    name: 'Oluwaseun Idowu',
    sname: 'UNILAG',
    description: 'Nunc sed libero sollicitudin faucibus. Aliquam viverra maecenas amet ut porta aliquam nunc morbi.',
    link: 'https://example.com/john',
    whatsapp: 'https://example.com/john'
  },
  {
    id: 2,
    image: lead1,
    name: 'Omotolani Okeowo',
    sname: 'FUTA',
    description: '"Participating in the mentorship program was a great experience for me. The guidance and support from the mentors have been instrumental in my professional..."',
    link: 'https://example.com/jane',
    whatsapp: 'https://example.com/john'
  },
  {
    id: 3,
    image: lead2,
    name: 'Aishat Odumuyiwa',
    sname: 'EKSU',
    description: '"The program has been a great platform for career and personal development for me. Having been taken through webinars with experts on areas like..."',
    link: 'https://example.com/david',
    whatsapp: 'https://example.com/john'
  },
  {
    id: 4,
    image: lead1,
    name: 'Blessing Adeyemi',
    sname: 'FUNAAB',
    description: '"Epoch gave me direction, purpose, and the tools to carve my path forward. If yoUre an undergraduate feeling lost, unsure of how to take that..."',
    link: 'https://example.com/emma',
    whatsapp: 'https://example.com/john'
  },
];

const Ambassador = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(3);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCards = cardsData.length;

  const slideLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalCards - cardsPerView : prevIndex - 1));
  };

  const slideRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalCards - cardsPerView ? 0 : prevIndex + 1));
  };

  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = 0; i < cardsPerView; i++) {
      const index = (currentIndex + i) % totalCards;
      visibleCards.push(cardsData[index]);
    }
    return visibleCards;
  };
  return (
    <>
      <div className="w-full mt-[83px] max-lg:mt-[62px] relative">
        <Image src={amba} alt="dcigi" className="w-full h-full max-lg:hidden"/>
        <Image src={ambam} alt="dcigi" className="w-full h-full lg:hidden"/>
        <div className="absolute amba flex items-center justify-center gap-[30px] flex-col left-0 top-0 h-full w-full">
          <h2 className="h1 text-white text-center">Become a Campus <br /> Champion with Epoch Africa! </h2>
          <p className="bt1 text-white text-center">Lead, Inspire, and Make an Impact in Your School Community</p>
          <button className="primarybtn">Apply now</button>
        </div>
      </div>
      <div className="w-full py-[80px] max-lg:py-[56px] flex flex-col items-center gap-[32px] justify-center max-lg:px-6">
        <h2 className="h2 text-black">Program Overview</h2>
        <p className="bt1 text-black text-center lg:w-[840px]">At Epoch Africa, we believe in the power of students to shape the future. Our Ambassadorship Program is designed to empower passionate undergraduates to lead the charge in their schools, helping their peers and younger students kickstart their careers while still in school. As an Epoch Champion, you’ll be at the forefront of a movement to redefine what it means to be a student, merging academic success with career readiness.</p>
      </div>
      <div className="w-full flex flex-col items-center justify-center bg-black px-10 max-lg:p-4">
        <div className="w-full flex flex-col items-center justify-center py-20 max-lg:py-10 lg:gap-8 gap-4">
          <h2 className="h2 text-primary">Your Role as an Ambassador</h2>
          <span className="bt1 text-white">As an Epoch Champion, you will</span>
        </div>
        <div className="grid grid-cols-2 gap-8 max-lg:gap-4 max-lg:grid-cols-1 mb-20 max-lg:mb-10">
          <div className="flex flex-col">
            <Image src={reach} alt="reach" className="w-full max-lg:hidden"/>
            <Image src={reachm} alt="reach" className="w-full lg:hidden"/>
            <div className="flex-grow w-full bg-[#33312E] flex flex-col gap-8 max-lg:gap-4 py-20 max-lg:py-10 max-lg:px-2 px-10">
              <h4 className="bodyfont text-white font-[700] text-[36px] max-lg:text-[20px] text-center">Reach Out</h4>
              <p className="bodyfont text-white font-[400] text-[18px] leading-7 lg:w-[544px] max-lg:text-[14px] text-center">Organize info sessions for secondary school students to introduce them to Epoch’s vision and offer pre- and post-admission support.
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <Image src={reach2} alt="reach" className="w-full max-lg:hidden"/>
            <Image src={reach2m} alt="reach" className="w-full lg:hidden"/>
            <div className="flex-grow w-full bg-[#33312E] flex flex-col gap-8 max-lg:gap-4 py-20 max-lg:py-10 max-lg:px-2 px-10">
              <h4 className="bodyfont text-white font-[700] text-[36px] max-lg:text-[20px] text-center">Undergraduate Career Club </h4>
              <p className="bodyfont text-white font-[400] text-[18px] leading-7 lg:w-[544px] max-lg:text-[14px] text-center">Establish the <Link href='' className="underline text-[#0078D4]">Undergraduate Career Club (UCC)</Link>. Create and lead a dynamic community in your school where students can connect, share resources, and receive tailored support for their career paths.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-20 max-lg:py-10 max-lg:px-4">
        <div className="flex flex-col items-center gap-2 justify-center">
          <h2 className="h2 text-[#111827]">Benefits for Ambassadors</h2>
          <span className="bt1 text-[#111827] bodyfont">As an Epoch Champion, you'll gain</span>
        </div>
        <div className="mt-10 lg:mt-20 grid grid-cols-3 max-lg:grid-cols-1 gap-8 max-lg:gap-4">
          <div className="rounded-[8px] flex flex-col justify-center items-center">
            <Image src={bulb} alt="ment" className="mb-8 max-lg:mb-4"/>
            <h5 className="text-[24px] max-lg:text-[18px] bodyfont text-[#111827] font-[700] mb-5 max-lg:mb-4 text-center">Professional Mentorship</h5>
            <p className="text-[16px] leading-6 font-[400] max-lg:text-[14px] bodyfont text-[#374151] text-center w-full">Receive one-on-one guidance from industry experts to help you grow personally and professionally.</p>
          </div>
          <div className="rounded-[8px] flex flex-col justify-center items-center">
            <Image src={world} alt="ment" className="mb-8 max-lg:mb-4"/>
            <h5 className="text-[24px] max-lg:text-[18px] bodyfont text-[#111827] font-[700] mb-5 max-lg:mb-4 text-center">Priority Access to Epoch Programs</h5>
            <p className="text-[16px] leading-6 font-[400] max-lg:text-[14px] bodyfont text-[#374151] text-center w-full">Enjoy early or exclusive access to Epoch’s resources, events, and opportunities.</p>
          </div>
          <div className="rounded-[8px] flex flex-col justify-center items-center">
            <Image src={amb1} alt="ment" className="mb-8 max-lg:mb-4"/>
            <h5 className="text-[24px] max-lg:text-[18px] bodyfont text-[#111827] font-[700] mb-5 max-lg:mb-4 text-center">Exclusive Community</h5>
            <p className="text-[16px] leading-6 font-[400] max-lg:text-[14px] bodyfont text-[#374151] text-center w-full">Join a network of like-minded individuals passionate about career-building.</p>
          </div>
          <div className="rounded-[8px] flex flex-col justify-center items-center">
            <Image src={amb2} alt="ment" className="mb-8 max-lg:mb-4"/>
            <h5 className="text-[24px] max-lg:text-[18px] bodyfont text-[#111827] font-[700] mb-5 max-lg:mb-4 text-center">Leadership Skills Development</h5>
            <p className="text-[16px] leading-6 font-[400] max-lg:text-[14px] bodyfont text-[#374151] text-center w-full">Hone your leadership abilities through our structured projects and activities.</p>
          </div>
          <div className="rounded-[8px] flex flex-col justify-center items-center">
            <Image src={amb5} alt="ment" className="mb-8 max-lg:mb-4"/>
            <h5 className="text-[24px] max-lg:text-[18px] bodyfont text-[#111827] font-[700] mb-5 max-lg:mb-4 text-center">Internship Opportunities</h5>
            <p className="text-[16px] leading-6 font-[400] max-lg:text-[14px] bodyfont text-[#374151] text-center w-full">Access exclusive internships with our partner firms and Epoch Africa.</p>
          </div>
          <div className="rounded-[8px] flex flex-col justify-center items-center">
            <Image src={amb6} alt="ment" className="mb-8 max-lg:mb-4"/>
            <h5 className="text-[24px] max-lg:text-[18px] bodyfont text-[#111827] font-[700] mb-5 max-lg:mb-4 text-center">Certificate of Achievement</h5>
            <p className="text-[16px] leading-6 font-[400] max-lg:text-[14px] bodyfont text-[#374151] text-center w-full">Earn recognition for your contributions to your school community.</p>
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-[56px]">
          <button className="primarybtn ">Apply now</button>
        </div>
      </div>
      <div className="w-full bg-[#F5F5F5] flex flex-col items-center justify-center p-20 max-lg:py-10 max-lg:px-4">
        <div className="flex flex-col items-center gap-2 justify-center">
          <h2 className="h2 text-[#111827] text-center">Application Process</h2>
          <span className="bt1 text-[#111827] bodyfont text-center">Ready to make an impact? Here’s how you can join us</span>
        </div>
        <span className="mt-8 mb-1 font-[700] bodyfont text-[#4F4F4F]">Notice: </span>
        <p className="bt2 font-[400] lg:w-[880px] text-center bodyfont text-[#4F4F4F]">If you're looking to build a career in community management, project management, program management, media and communications, digital marketing, strategy, creative fields like graphic design, public relations management, or corporate communications, this program is perfect for you. However, this is not to discourage students with other career interests from applying.</p>
        <div className="w-full grid grid-cols-4 max-lg:grid-cols-1 gap-8 max-lg:gap-4 mt-10">
          <div className="flex items-start justify-center gap-[10px] flex-col amcard py-10 px-5">
            <div className="rounded-full w-[50px] h-[50px] p-2 border-2 border-primary flex items-center justify-center">
              <span className="h3 text-primary">1</span>
            </div>
            <h6 className="bodyfont text-[18px] font-[600] text-[#242424]">Fill Out the Application</h6>
            <h6 className="bodyfont text-[14px] font-[400] text-[#242424]">Click the button below to start your journey as an Epoch Champion.</h6>
          </div>
          <div className="flex items-start justify-center gap-[10px] flex-col amcard py-10 px-5">
            <div className="rounded-full w-[50px] h-[50px] p-2 border-2 border-primary flex items-center justify-center">
              <span className="h3 text-primary">2</span>
            </div>
            <h6 className="bodyfont text-[18px] font-[600] text-[#242424]">Choose Your School</h6>
            <h6 className="bodyfont text-[14px] font-[400] text-[#242424]">Select your university from the list to connect with your school’s lead ambassador.</h6>
          </div>
          <div className="flex items-start justify-center gap-[10px] flex-col amcard py-10 px-5">
            <div className="rounded-full w-[50px] h-[50px] p-2 border-2 border-primary flex items-center justify-center">
              <span className="h3 text-primary">3</span>
            </div>
            <h6 className="bodyfont text-[18px] font-[600] text-[#242424]">Submit Your Application</h6>
            <h6 className="bodyfont text-[14px] font-[400] text-[#242424]">Share why you want to become an Epoch Champion and how you plan to make a difference.</h6>
          </div>
          <div className="flex items-start justify-center gap-[10px] flex-col amcard py-10 px-5">
            <div className="rounded-full w-[50px] h-[50px] p-2 border-2 border-primary flex items-center justify-center">
              <span className="h3 text-primary">4</span>
            </div>
            <h6 className="bodyfont text-[18px] font-[600] text-[#242424]">Get Started</h6>
            <h6 className="bodyfont text-[14px] font-[400] text-[#242424]">Once selected, you'll receive training and resources to begin your mission.</h6>
          </div>
        </div>
      </div>
      <div className="w-full bg-black p-20 max-lg:px-4 max-lg:py-10 grid grid-cols-2 max-lg:grid-cols-1 gap-20">
        <div className="flex flex-col gap-8 max-lg:items-center max-lg:justify-center max-lg:text-center">
          <h2 className="h2 text-white">Ready to Lead?</h2>
          <p className="bt2 text-white lg:w-[488px]">Applications are now open for students from the following schools: <br />
          Obafemi Awolowo University, University of Ibadan, University of Lagos, Adeleke University, Bowen University, Lagos State University, Federal University of Technology Akure, Ekiti State University, Ladoke Akintola University of Technology, Leadcity University, Osun State University.</p>
          <div className="">
          <button className="primarybtn">Apply now</button>
          </div>
        </div>
        <Image src={ambim} alt="image" className="lg:hidden"/>
        <div className="relative max-lg:hidden overflow-hidden h-[360px]">
        <Image src={ambi} alt="ux" className="absolute top-0 left-0 w-full h-full"/>
        <div className="absolute top-10 left-[110px] flex flex-col gap-[64px]">
          <div className="flex items-center gap-[64px] justify-center">
            <Image src={school1} alt="image" className="h-[64px]"/>
            <Image src={school2} alt="image" className="h-[64px]"/>
            <Image src={school3} alt="image" className="h-[64px]"/>
            <Image src={school4} alt="image" className="h-[64px]"/>
          </div>
          <div className="flex items-center gap-[64px] justify-center">
            <Image src={school5} alt="image" className="h-[64px]"/>
            <Image src={school6} alt="image" className="h-[64px]"/>
            <Image src={school7} alt="image" className="h-[64px]"/>
            <Image src={school8} alt="image" className="h-[64px]"/>
          </div>
          <div className="flex items-center gap-[64px] justify-center">
            <Image src={school9} alt="image" className="h-[64px]"/>
            <Image src={school10} alt="image" className="h-[64px]"/>
            <Image src={school11} alt="image" className="h-[64px]"/>
          </div>
        </div>
        </div>
      </div>
      <div className="w-full lg:p-[80px] py-10 px-4">
      <div className="text-center mb-16 flex flex-col gap-2">
        <h2 className="h2 text-[#111827] max-lg:text-center">Contact Your School Lead</h2>
        <p className="text-[18px] bodyfont font-[400] text-[#111827] max-lg:text-[14px]">For personalized guidance, connect with your school’s lead ambassador.</p>
      </div>
      <div className="w-full flex items-center flex-col justify-center">
        <div className="w-full grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="">
          {getVisibleCards().slice(0,1).map((card) => (
            <div
              key={card.id}
              className="flex flex-col"
            >
              <div className="w-full flex items-center justify-center bg-[#00A699] lg:h-[252px] max-lg:rounded-tl-[24px] max-lg:rounded-tr-[125px] rounded-tl-[125px] rounded-tr-[24px] mb-4">
                <Image
                  src={card.image}
                  alt={card.name}
                  className="object-cover mt-10"
                />
              </div>
              <div className="px-[25px] py-4 flex flex-col">
                <h3 className="h3 text-[#2A282F] mb-1 text-center">{card.name}</h3>
                <h4 className="h4 text-[#625F68] mb-6 text-center">{card.sname}</h4>
                <div className="w-full flex items-center justify-center gap-7 mb-6">
                  <Link href={card.link} className="text-[#0A66C2] h-[26px]"><FaLinkedin className="w-full h-full"/></Link>
                  <Link href={card.whatsapp} className="text-[#25D366] h-[26px]"><FaWhatsapp className="w-full h-full"/></Link>
                </div>
                <p className="text-gray-500 mb-5 text-center">{card.description}</p>
              </div>
            </div>
          ))}
          </div>
          <div className="">
          {getVisibleCards().slice(1,2).map((card) => (
            <div
              key={card.id}
              className="flex flex-col"
            >
              <div className="w-full flex items-center justify-center bg-[#00A699] lg:h-[252px] rounded-t-[24px] mb-4">
                <Image
                  src={card.image}
                  alt={card.name}
                  className="object-cover mt-10"
                />
              </div>
              <div className="px-[25px] py-4 flex flex-col">
                <h3 className="h3 text-[#2A282F] mb-1 text-center">{card.name}</h3>
                <h4 className="h4 text-[#625F68] mb-6 text-center">{card.sname}</h4>
                <div className="w-full flex items-center justify-center gap-7 mb-6">
                  <Link href={card.link} className="text-[#0A66C2] h-[35px]"><FaLinkedin className="w-full h-full"/></Link>
                  <Link href={card.whatsapp} className="text-[#25D366] h-[35px] w-[35px]"><FaWhatsapp className="w-full h-full"/></Link>
                </div>
                <p className="text-gray-500 mb-5 text-center">{card.description}</p>
              </div>
            </div>
          ))}
          </div>
          <div className="">
          {getVisibleCards().slice(2,3).map((card) => (
            <div
              key={card.id}
              className="flex flex-col"
            >
              <div className="w-full flex items-center justify-center bg-[#00A699] lg:h-[252px] rounded-tr-[125px] rounded-tl-[24px] mb-4">
                <Image
                  src={card.image}
                  alt={card.name}
                  className="object-cover mt-10"
                />
              </div>
              <div className="px-[25px] py-4 flex flex-col">
                <h3 className="h3 text-[#2A282F] mb-1 text-center">{card.name}</h3>
                <h4 className="h4 text-[#625F68] mb-6 text-center">{card.sname}</h4>
                <div className="w-full flex items-center justify-center gap-7 mb-6">
                  <Link href={card.link} className="text-[#0A66C2] h-[35px]"><FaLinkedin className="w-full h-full"/></Link>
                  <Link href={card.whatsapp} className="text-[#25D366] h-[35px] w-[35px]"><FaWhatsapp className="w-full h-full"/></Link>
                </div>
                <p className="text-gray-500 mb-5 text-center">{card.description}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
        <div className="items-center w-full flex justify-center mt-4">
          <div className="items-center flex justify-center gap-10 lg:gap-[215px]">
            <button onClick={slideLeft} className="p-2 text-[#1E1E1E] gap-2 flex items-center">
              <FaArrowLeft  className="h-[14px] w-[14px]"/>
              <span className='text-[14px] lg:text-[18px] font-[400]'>Previous</span>
            </button>
            <button onClick={slideRight} className="p-2 text-[#1E1E1E] gap-2 flex items-center">
              <span className='text-[14px] lg:text-[18px] font-[400]'>Next</span>
              <FaArrowRight className="h-[14px] w-[14px]" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Ambassador