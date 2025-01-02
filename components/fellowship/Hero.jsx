/* eslint-disable react/no-unescaped-entities */
import heroImage from '@/public/fellhero.png'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <> 
        <div className='w-full bg-[#F5F5F5] flex max-lg:flex-col-reverse mt-[83px] max-lg:mt-[62px] p-0'>
            <div className="flex items-center justify-center lg:w-[60%] w-full p-[60px] max-md:p-[20px] max-lg:p-[40px]">
            <div className="flex flex-col gap-[40px] max-lg:gap-[25px] max-lg:mb-10  max-lg:text-center h-full justify-center">
                <h1 className='h1'>Kickstart Your Career Journey with <span className="text-[#E9672B]">Epoch Fellowship!</span></h1>
                <p className="bt1 lg:w-[80%]">
                Figure out your next steps towards a successful career, connect with inspiring mentors, and build the skills you need for your future. 
                </p>
                <div className="flex max-lg:flex-col max-lg:justify-center w-full max-lg:gap-[18px] items-center gap-[70px]">
                    <Link href='/auth' className="primarybtn">
                    Enroll for free
                    </Link>
                    <Link href='/about' className="tbtn">
                    Learn more about the program
                    </Link>
                </div>
            </div>
            </div>
            <div className='p-4 h-full flex lg:w-[50%] w-full items-center justify-center'>
                <Image src={heroImage} alt='hero' className='w-full'/>
            </div>
        </div>
    </>
  )
}

export default Hero