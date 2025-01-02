/* eslint-disable react/no-unescaped-entities */
import heroimage from '@/public/abouthero.png'
import Image from 'next/image'

const Hero = () => {
  return (
    <> 
        <div className="w-full flex max-lg:flex-col-reverse mt-[83px] max-lg:mt-[62px] bg-[#F5F5F5]">
            <div className="flex lg:w-[45%] w-full p-[80px] max-lg:p-4 items-center">
              <div className="w-full flex-col gap-[28px] max-lg:gap-[11px] flex items-start">
                  <h3 className='abouthero text-primary font-[400] text-[45px] leading-[52px] max-lg:text-center max-lg:text-[24px] w-full'>About Epoch</h3>
                  <p className="bt1">Epoch is dedicated to empowering Nigerian undergraduates by providing them with the resources and guidance they need to start building their careers while still in school. Whether you're unsure where to begin or already have a clear direction, Epoch offers tools, mentorship, and opportunities to help you succeed.</p>
              </div>
            </div>
            <div className="lg:w-[55%] w-full">
                <Image src={heroimage} alt='heroimage' className='w-full h-full'/>
            </div>
        </div>
    </>
  )
}

export default Hero