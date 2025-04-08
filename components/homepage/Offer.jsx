"use client"
import Image from 'next/image';
import Link from 'next/link';
import offerImage from '@/public/offer.png';
import { useState } from 'react';

const accordionData = [
  {
    title: 'Fellowship Program',
    description:
      'A phased mentorship program designed to guide you through discovering your career path, planning your journey, and implementing your goals with the support of experienced professionals.',
    url: '/fellowship',
    cta: 'Join the program'
  },
  {
    title: 'Prospecta by Epoch',
    description:
      'Get a curated list of the best opportunities every day and every week in your inbox —internships, scholarships, workshops, and more, all tailored to Nigerian undergraduates.',
    url: '/newsletter',
    cta: 'Subscribe to Prospecta'
  },
  {
    title: 'Ambassadorship Program',
    description:
      'Represent Epoch on your campus! Join our Ambassadorship Program and help spread the word while building your leadership and career skills.',
    url: '/ambassadors',
    cta: 'Learn more...'
  },
  {
    title: 'Epoch Podcast',
    description:
      'Represent Epoch on your campus! Join our Tune in every month to hear inspiring stories from undergraduates who are excelling in their fields and recent graduates who have successfully transitioned into their careers.',
    url: 'https://open.spotify.com/show/26oCnoZaWz98tIE6u7WwiI?si=Jpk97VF4RdmWR-kPkVh8Ng',
    cta: 'Listen now'
  },
];

const Offer = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div id="offerings" className="w-full flex-col items-center justify-center py-[140px] max-lg:py-[64px]">
        <div className="flex-col items-center justify-center flex gap-2">
          <h1 className="h2 text-accent text-center">What We Offer</h1>
          <span className="b1">Unlock Your Potential with Epoch</span>
        </div>
        <div className="w-full flex items-center lg:space-x-[190px] max-lg:space-y-5 p-2 max-lg:flex-col lg:p-[140px]">
          <div className="rounded-[30px] lg:w-[50%] w-full">
            <Image src={offerImage} alt="offer image" className="w-full" />
          </div>
          <div className="flex justify-center items-center rounded-[20px] w-[50%] max-lg:w-full">
            <div className="flex-col border-solid max-lg:py-[13px]  border-[#F5F5F5] rounded-[20px] border py-[20px] w-full">
              {accordionData.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-start justify-center px-[30px] ${
                    activeIndex === index
                      ? 'shadow-lg border-[#F5F5F5] rounded-[30px] border max-lg:py-[20px] py-[30px]'
                      : ''
                  }`}
                >
                  <button
                    className={`h3 transition-all duration-200 py-[10px] rounded-[20px] ${
                      activeIndex === index ? 'mb-[30px]' : ''
                    }`}
                    onClick={() => toggleAccordion(index)}
                  >
                    {item.title}
                  </button>
                  {activeIndex === index && (
                    <div
                      className={`transition-all duration-200 ${
                        activeIndex === index ? 'mb-4' : ''
                      }`}
                    >
                      {item.description}
                    </div>
                  )}
                  {activeIndex === index && (
                    <Link
                      href={item.url}
                      className={`transition-all duration-200 primarybtn ${
                        activeIndex === index ? 'mb-4' : ''
                      }`}
                    >
                      {item.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Offer;
