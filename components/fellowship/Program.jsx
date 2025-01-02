/* eslint-disable react/no-unescaped-entities */
import ps from '@/public/ps.svg'
import ps1 from '@/public/ps1.svg'
import ps2 from '@/public/ps2.svg'
import Image from 'next/image'
import Link from 'next/link'
import { MdNavigateNext } from 'react-icons/md'

const Program = () => {
  return (
    <div className='w-full flex-col flex items-center lg:gap-[48px] gap-[24px] justify-center max-lg:py-[40px] max-lg:px-4 px-[80px] py-[140px]'>
        <h2 className="h2">Program Structure</h2>
        <div className="w-full gap-[24px] max-lg:gap-[12px] flex flex-col">
            <div className="w-full flex pscard lg:gap-[65px] gap-[32px] items-start p-5">
                <Image src={ps} alt='svg'/>
                <div className="px-5 w-full">
                    <div className="flex items-center w-full justify-between">
                        <div className="flex flex-col gap-[10px]">
                            <h4 className="h4">Discovery Phase</h4>
                            <div className="bg-[#00A699] px-[15px] py-[6px] rounded-[8px] text-white max-w-[95px]">2 weeks</div>
                        </div>
                        <Link href='#' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
                            <span className=''>Learn More</span>
                            <MdNavigateNext className='mt-1'/>
                        </Link>
                    </div>
                    <p className="bt1 text-[#2E2E2E] mt-[25px]">Start by identifying your strengths, exploring career options, and selecting the right path for you. With guided self-assessments, career research, and expert consultations, you'll gain clarity on your professional journey.</p>
                </div>
            </div>
            <div className="w-full flex pscard lg:gap-[65px] gap-[32px] items-start p-5">
                <Image src={ps1} alt='svg'/>
                <div className="px-5 w-full">
                    <div className="flex items-center w-full justify-between">
                        <div className="flex flex-col gap-[10px]">
                            <h4 className="h4">Planning Phase</h4>
                            <div className="bg-[#00A699] px-[15px] py-[6px] rounded-[8px] text-white max-w-[95px]">2 weeks</div>
                        </div>
                        <Link href='#' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
                            <span className=''>Learn More</span>
                            <MdNavigateNext className='mt-1'/>
                        </Link>
                    </div>
                    <p className="bt1 text-[#2E2E2E] mt-[25px]">Develop a personalized career plan, including short-term, mid-term, and long-term goals. Learn how to optimize your LinkedIn profile, build a professional network, and create an actionable roadmap to achieve your ambitions.</p>
                </div>
            </div>
            <div className="w-full flex pscard lg:gap-[65px] gap-[32px] items-start p-5">
                <Image src={ps2} alt='svg'/>
                <div className="px-5 w-full">
                    <div className="flex items-center w-full justify-between">
                        <div className="flex flex-col gap-[10px]">
                            <h4 className="h4">Implementation Phase</h4>
                            <div className="bg-[#00A699] px-[15px] py-[6px] rounded-[8px] text-white max-w-[95px]">2 weeks</div>
                        </div>
                        <Link href='#' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
                            <span className=''>Learn More</span>
                            <MdNavigateNext className='mt-1'/>
                        </Link>
                    </div>
                    <p className="bt1 text-[#2E2E2E] mt-[25px]">Put your plan into action. Engage in workshops on networking, communication, leadership, and more. Complete projects relevant to your chosen field, build a professional portfolio and receive ongoing support from your mentors and peers.</p>
                </div>
            </div>
        </div>
        <div className="p-4 flex items-center justify-center gap-10 max-lg:gap-5">
            <button className='primarybtn'>Enroll for free</button>
            <button className='psbtn bg-white'>Learn more about each phase</button>
        </div>
    </div>
  )
}

export default Program