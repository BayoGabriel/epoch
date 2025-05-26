/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from 'react';
import { MdNavigateNext } from "react-icons/md";
import { XMLParser } from 'fast-xml-parser';
import Image from 'next/image';
import one from '@/public/1.png'
import two from '@/public/2.png'
import three from '@/public/3.png'
import four from '@/public/4.png'
import Link from 'next/link';

const RSS_URL = 'https://anchor.fm/s/e70bf300/podcast/rss'; 

const WhatsNew = () => {
  const [error, setError] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(RSS_URL);
        const data = await response.text();
        const parser = new XMLParser();
        const jsonObj = parser.parse(data);
        const latestEpisodes = jsonObj.rss.channel.item.slice(0, 4); 
        setEpisodes(latestEpisodes);
      } catch (error) {
        console.error("Error fetching RSS feed:", error);
        setError("Failed to fetch episodes.");
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <div className="w-full flex justify-between">
      <div className="lg:w-[96%] w-full bg-black rounded-r-[16px] max-lg:rounded-[16px] py-[64px] px-4 lg:p-[80px]">
        <h2 className="h2 text-primary mb-[46px] max-lg:mb-4 text-center">What's New at Epoch?</h2>
        <div className="w-full flex items-center justify-between">
          <h3 className="h3 text-white">Latest Podcast Episodes</h3>
          <Link href="https://open.spotify.com/show/26oCnoZaWz98tIE6u7WwiI?si=Jpk97VF4RdmWR-kPkVh8Ng" className="flex items-center h-full gap-1 text-[#DCDEE1]">
            <span>See more</span>
            <MdNavigateNext className='mt-[3px]' />
          </Link>
        </div>
        <div className="w-full mt-[32px] grid grid-cols-4 gap-2 max-lg:grid-cols-1">
          <div className="overflow-hidden">
          <iframe src="https://open.spotify.com/embed/episode/1qrIRNeiBijp2drjVCt7dR?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
          <div className='overflow-hidden'>
          <iframe className='w-full' src="https://open.spotify.com/embed/episode/68OBY2Z47yWfyT6IZDtebl?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
          <div className="overflow-hidden">
          <iframe className='w-full' src="https://open.spotify.com/embed/episode/6ldlvtp5RUGLdHqnPepSym?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
          <div className="overflow-hidden">
          <iframe className='w-full' src="https://open.spotify.com/embed/episode/3NKyhhXhrTaShDBLztfWXC?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        </div>
      </div>
      <div className="w-[4%] flex items-start justify-center max-lg:hidden">
        <span className="text-accent rounded-full bg-accent size-[24px]"></span>
      </div>
    </div>
  );
}

export default WhatsNew;
