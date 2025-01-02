"use client"
import Image from 'next/image'
import tof from '@/public/tof.png'
import gab from '@/public/gabb.png'
import abi from '@/public/abi.png'
import { FaLinkedin } from 'react-icons/fa6'
import Link from 'next/link'

const TeamMember = ({ image, name, role, description, gon }) => (
  <div className="team flex flex-col h-full">
    <div className="w-full bg-accent rounded-tl-[126px] rounded-tr-[20px] max-lg:h-[232px] flex items-end justify-center h-[252px] overflow-hidden">
      <Image src={image} alt={name} className='w-[80%] object-cover'/>
    </div>
    <div className="w-full flex flex-col items-center justify-between bg-[#F7F6FA] px-4 py-6 gap-6 max-lg:gap-[22px] flex-grow">
      <div className="w-full flex flex-col gap-[2px]">
        <h4 className="font-[400] abouthero text-[24px] text-[#2A282F] text-center">{name}</h4>
        <h4 className="h4 text-center">{role}</h4>
      </div>
      <Link href={gon} target="_blank" rel="noopener noreferrer">
        <FaLinkedin className='size-[26px] text-[#0A66C2]' />
      </Link>
      <p className="bt2 text-center">{description}</p>
    </div>
  </div>
)

const Team = () => {
  const teamMembers = [
    {
      image: tof,
      name: "Oluwatofunmi Idowu",
      role: "Founder",
      description: "Experience in Strategy consulting, Startup Support, and Venture Capital.",
      gon: 'https://www.linkedin.com/in/idowu-oluwatofunmi/' // Add correct LinkedIn URL here if available
    },
    {
      image: abi,
      name: "Abigail AyanfeJesu",
      role: "Co-Founder",
      description: "Experience in Marketing; Social Media, Content Marketing, PR, etc.",
      gon: 'https://www.linkedin.com/in/abigail-ayanfejesu-91025b19a/?originalSubdomain=ng'
    },
    {
      image: gab,
      name: "Gabriel Bayode",
      role: "Co-Founder",
      description: "Experience in Software Development, Entrepreneurship, etc.",
      gon: 'https://www.linkedin.com/in/bayogabriel'
    }
  ]

  return (
    <div className="w-full py-[80px] max-lg:py-8 px-4 md:px-8 lg:px-56">
      <div className="w-full flex gap-8 max-lg:gap-4 flex-col items-center justify-center">
        <h2 className="h2">Meet the Team</h2>
        <p className="bt1 lg:w-[624px] text-center">
          We began building our careers while still in school, graduated in 2023, and have since thrived in our post-graduation careers.
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-[80px] max-lg:mt-10">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </div>
  )
}

export default Team
