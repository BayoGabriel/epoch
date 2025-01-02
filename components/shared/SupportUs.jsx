import Link from 'next/link'
import React from 'react'

const SupportUs = () => {
  return (
    <div className='w-full p-[80px] max-lg:p-0'>
        <div className="w-full bg-black rounded-[16px] flex items-center justify-center">
        <div className="w-full flex flex-col items-center lg:w-[574px] gap-[30px] justify-center py-10 px-[10px]">
            <h2 className="h2 text-white">Support our mission</h2>
            <p className="bt1 text-white text-center">Your donation helps provide essential resources, mentorship, and opportunities to undergraduates across Nigeria. Empower the next generation to build their careers and make a lasting impact.</p>
            <Link target='_blank' href="https://paystack.com/pay/supportepoch" className="primarybtn">Donate Now</Link>
        </div>
        </div>
    </div>
  )
}

export default SupportUs