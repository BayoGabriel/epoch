/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';
import idowu from '@/public/idowu.png';
import tolani from '@/public/tolani.png';
import aishat from '@/public/aishat.png';
import blessing from '@/public/blessing.png';

const cardsData = [
  {
    id: 1,
    image: idowu,
    name: 'Oluwaseun Idowu',
    sname: 'Oluwaseun',
    description: '"Epoch mentorship program really has helped me in building and growing my career. The deadlines really prompted me to achieve a lot more than I..."',
    fullStory: 'The epoch mentorship program really has helped me in building and growing my career. The deadlines really prompted me to achieve a lot more than I thought I could within a short term. The experts in career advancement that were involved were truly amazing as they took us on a very interactive journey to career independence. It was a great experience and I am glad that I am a part of this program. Thank you Epoch',
  },
  {
    id: 2,
    image: tolani,
    name: 'Omotolani Okeowo',
    sname: 'Omotolani',
    description: '"Participating in the mentorship program was a great experience for me. The guidance and support from the mentors have been instrumental in my professional..."',
    fullStory: 'Participating in the mentorship program, and also assuming the role of the cohort 1 captain has been a great experience for me. The guidance and support from the mentors have been instrumental in my professional development. Through valuable resources, and a supportive community, I have gained clarity in my career path. The program not only provided me with the skills needed to excel but also connected me with a network of like-minded individuals who motivate each other. I would recommend this mentorship program to anyone seeking to advance their career, develop new skills, and build meaningful connections.',
  },
  {
    id: 3,
    image: aishat,
    name: 'Aishat Odumuyiwa',
    sname: 'Aishat',
    description: '"The program has been a great platform for career and personal development for me. Having been taken through webinars with experts on areas like..."',
    fullStory: 'The Epoch and CV2essence mentorship program has been a great platform for career and personal development for me. Haven been taken through webinars with experts on areas like networking and CV crafting, I feel better equipped than before in taking charge of my career. However, the program`s most significant impact for me was achieving clarity in my career aspirations and receiving guidance on developing a skill roadmap aligned with my goals. Additionally, I appreciated the support provided during the weekly check-ins and progress update calls that put me on my toes to completing my first ever project. I highly recommend this program to anyone struggling with actually taking action towards the career they desire or simply seeking to elevate their professional skills.',
  },
  {
    id: 4,
    image: blessing,
    name: 'Blessing Adeyemi',
    sname: 'Blessing',
    description: '"Epoch gave me direction, purpose, and the tools to carve my path forward. If yoUre an undergraduate feeling lost, unsure of how to take that..."',
    fullStory: 'The other day, I saw a tweet that said, “This year should be called, ‘Things I Never Thought Could Happen.’” Honestly, that couldn’t be more accurate! If someone had told me back in February that I’d be where I am today, I would’ve laughed them off. I knew I had to make a change, but I had no idea what direction to take or how to even begin. I was completely lost. Then, out of nowhere, I stumbled on a post about the Epoch Mentorship Program. It was aimed at undergraduates looking to kick-start their careers. I didn`t even have the means to apply at that point, but thankfully, I found a way and sent in my application. Little did I know, that one decision would change the entire course of my year. From the moment the program began, my life took a 180. The mentorship, guidance, webinars, deadlines—it all transformed me. I`ve learned more in these past few months than in any other program I`ve ever been part of. And to be honest, I almost didn`t make it to the end due to a few challenges. But I did, and I couldn`t be more thankful. Epoch gave me direction, purpose, and the tools to carve my path forward. If you`re an undergraduate feeling lost, unsure of how to take that first step, I can`t recommend this program enough. Epoch didn`t just give me knowledge—it gave me the confidence to step into my future. And that`s something I`ll carry with me always.',
  },
];

const Feedback = () => {
  const [modal, setModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
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

  const handleModalClick = (card) => {
    setActiveCard(card);
    setModal(true);
  };

  return (
    <>
      <div className="w-full lg:p-[80px] py-10 px-4">
        <div className="text-center mb-5 flex flex-col gap-1">
          <h2 className="h2 text-accent max-lg:text-center">See How Epoch is Making a Difference</h2>
          <p className="text-[18px] roboto font-[400] max-lg:text-[14px]">Epoch Spotlight</p>
        </div>
        <div className="w-full flex items-center flex-col justify-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getVisibleCards().map((card) => (
              <div
                key={card.id}
                className="flex flex-col items-center justify-between py-[20px] px-[25px] border border-[#DCDEE1] card2 gap-[18px] relative"
              >
                <div className="w-full flex items-center justify-center mb-4">
                  <Image
                    src={card.image}
                    alt={card.name}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="h4 text-black mb-2 text-center">{card.name}</h3>
                <p className="text-gray-500 mb-5 text-center">{card.description}</p>
                <button onClick={() => handleModalClick(card)} className="bt1 text-primary underline">
                  Read {card.sname}'s story
                </button>
              </div>
            ))}
          </div>
          <div className="items-center w-full flex justify-center mt-4 lg:hidden">
            <div className="items-center flex justify-center gap-10">
              <button onClick={slideLeft} className="p-2 text-[#757575] gap-2 flex items-center">
                <FaArrowLeft />
                <span className='text-[14px] font-[400]'>Previous</span>
              </button>
              <button onClick={slideRight} className="p-2 text-[#757575] gap-2 flex items-center">
                <span className='text-[14px] font-[400]'>Next</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      {modal && activeCard && 
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[600px] my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-10">
                <div className="flex items-center justify-end mb-4">
                  <button onClick={() => setModal(false)} className="rounded-full size-[32px] hover:bg-slate-200">✕</button>
                </div>
                <div className="relative flex-grow flex flex-col items-center justify-center gap-4 max-lg:gap-2">
                  <Image src={activeCard.image} alt='ty'/>
                  <h6 className="text-[16px] font-[700] text-[#212B36]">{activeCard.name}</h6>
                  <p className="text-gray-700 text-center">{activeCard.fullStory}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      }
    </>
  );
};

export default Feedback;
