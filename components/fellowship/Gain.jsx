/* eslint-disable react/no-unescaped-entities */
import gain from '@/public/gain.svg'
import gain1 from '@/public/gain1.svg'
import gain2 from '@/public/gain2.svg'
import gain3 from '@/public/gain3.svg'
import Image from 'next/image'

const Gain = () => {
  return (
    <>
        <div className="w-full flex-col lg:gap-[64px] gap-[32px] flex items-center justify-center max-lg:py-[40px] max-lg:px-4 px-[80px] py-[140px]">
            <h2 className="h2">What You’ll Gain from the Program</h2>
            <div className="w-full grid grid-cols-4 max-lg:grid-cols-1 gap-[64px] max-lg:gap-[32px]">
                <div className="flex flex-col items-center justify-center gap-[18px]">
                    <Image src={gain} alt='image'/>
                    <h4 className="h4">Personalized Mentorship</h4>
                    <p className="bt1 text-[#2E2E2E]">Get one-on-one guidance from industry professionals who’ve been where you are now.</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-[18px]">
                    <Image src={gain1} alt='image'/>
                    <h4 className="h4">Networking Opportunities</h4>
                    <p className="bt1 text-[#2E2E2E]">Connect with peers, mentors, and professionals who can help you along your journey.</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-[18px]">
                    <Image src={gain2} alt='image'/>
                    <h4 className="h4">Real-World Projects</h4>
                    <p className="bt1 text-[#2E2E2E]">Work on projects that mirror real-world challenges, giving you a taste of what’s to come.</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-[18px]">
                    <Image src={gain3} alt='image'/>
                    <h4 className="h4">Skill-Building Workshops</h4>
                    <p className="bt1 text-[#2E2E2E]">Participate in workshops that equip you with the skills employers are looking for.</p>
                </div>
            </div>
            <button className="primarybtn">Enroll for free</button>
        </div>
    </>
  )
}

export default Gain