/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import play from '@/public/play.svg'
import mission from '@/public/mission.png'
import skill from '@/public/skill.png'
import skill1 from '@/public/skill1.png'

const Mission = () => {
  return (
    <>
      <div className="w-full grid grid-cols-2 max-lg:grid-cols-1 gap-8 max-lg:gap-5 lg:px-[360px] lg:py-[80px] px-4 py-[40px]">
        <div className="flex flex-col items-start justify-start max-lg:justify-start max-lg:items-center">
          <h2 className="h2 text-accent flex lg:flex-row-reverse max-lg:gap-1 items-center justify-center max-lg:text-center">
            <span className="lg:order-1 max-lg:order-2">Mission<span className='max-lg:hidden'>.</span></span>
            <span className='max-lg:items-center max-lg:justify-center flex size-2 rounded-full bg-accent lg:hidden'></span>
          </h2>
          <p className="bt1 max-lg:text-center">To encourage and support undergraduates in Africa to actively prepare for their careers before graduation.</p>
        </div>
        <div className="flex flex-col items-start max-lg:items-center justify-start">
          <h2 className="h2 text-accent flex lg:flex-row-reverse max-lg:gap-1 items-center justify-center max-lg:text-center">
            <span className="lg:order-1 max-lg:order-2">Vission<span className='max-lg:hidden'>.</span></span>
            <span className='max-lg:items-center max-lg:justify-center flex size-2 rounded-full bg-accent lg:hidden'></span>
          </h2>
          <p className="bt1 max-lg:text-center">A generation of African graduates who enter the workforce confident, capable, and ready to excel</p>
        </div>
      </div>
      <div className="w-full lg:p-[80px] py-[40px] flex flex-col gap-8">
        <h2 className="h2 text-black text-center">The story behind what Epoch is today</h2>
        <div className="w-full relative overflow-hidden max-lg:h-[187px]">
        <div className="w-full h-full">
          <iframe
            src="https://drive.google.com/file/d/1ma4Y2MVsFZB44ulFFbZVAQ_3t8bZnhUb/preview"
            className="w-full h-[800px] max-lg:h-full"
            allow="autoplay; fullscreen"
          />
        </div>
          {/* <div className="w-full mission absolute h-full top-0 left-0"></div> */}
          <p className="bodyfont max-lg:text-[11px] font-[400] max-lg:leading-[14px] text-[16px] leading-6 absolute w-[260px] max-lg:w-[141px] top-[56px] left-[56px] max-lg:top-2 max-lg:left-2 text-white">
            Listen to how we started and what led us to where we are at today. In this video, you will get to understand what drives us, and how we decide on what is next in this journey.
          </p>
        </div>
      </div>
      <div className="w-full bg-[#F5F5F5] px-4 py-8 lg:p-[80px] flex items-center justify-center">
        <div className="w-full flex flex-col lg:w-[842px]">
          <h2 className="h2 text-black mb-8 text-center">What keeps us up at night: Youth Unemployment</h2>
          <p className="bt1 text-center mb-6">Youth unemployment in Africa is alarmingly high. The World Bank estimates the rate to be around 60%. This issue persists even though many young people attend universities. According to the African Center for Economic Transformation (ACET), a staggering 50% of African graduates still don't find work after completing their studies. Nigeria faces a particularly harsh reality, with half of its graduates unemployed each year. There are two main reasons behind this high youth unemployment: skill mismatch and job quantity mismatch.</p>
          <div className="w-full grid grid-cols-2 max-lg:grid-cols-1 gap-8">
            <div className="flex flex-col">
              <Image src={skill1} alt='skill' className='w-full'/>
              <div className="w-full flex flex-col gap-5 skillcard max-lg:px-[22px] max-lg:py-[22px] max-lg:gap-4 rounded-b-[8px] py-[30px] px-[28px] flex-1 shadow-lg">
                <h4 className="abouthero text-[24px] text-center font-[400] leading-7 text-black">Skill Mismatch</h4>
                <p className="bt1 text-center">
                  Universities often don't equip students with the skills employers actually need. The education received in classrooms may not translate to the practical skills required for available jobs.
                </p>
              </div>
              <div className="mt-4"></div>
            </div>
            <div className="flex flex-col">
              <Image src={skill} alt='skill' className='w-full'/>
              <div className="w-full flex flex-col gap-5 skillcard max-lg:px-[22px] max-lg:py-[22px] max-lg:gap-4 rounded-b-[8px] py-[30px] px-[28px] flex-1 shadow-lg">
                <h4 className="abouthero text-[24px] text-center font-[400] leading-7 text-black">Job Quantity Mismatch</h4>
                <p className="bt1 text-center">
                  The number of jobs created annually falls far short of the number of graduates entering the workforce. In some cases, there are 15 million graduates seeking jobs, while only 3 million positions are available.
                </p>
              </div>
              <div className="mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Mission