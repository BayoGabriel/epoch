/* eslint-disable react/no-unescaped-entities */
import vlt from '@/public/vlt.png'
import Image from 'next/image'
import Link from 'next/link'

const Volunteer = () => {
  return (
    <div className='w-full grid grid-cols-2 max-lg:grid-cols-1 gap-[41px] p-[80px] max-lg:px-0 max-lg:py-4 max-lg:mb-10'>
        <div className="flex flex-col items-start lg:w-[515px] justify-center gap-[30px] max-lg:px-8">
            <h2 className="h2">Volunteer your time</h2>
            <p className="bt1">Do you have any skills that would be beneficial to realizing Epoch's vision? We are happy to welcome you.</p>
            <Link target='_blank' href="https://docs.google.com/forms/d/e/1FAIpQLSfBRMRz1KjWVug1C1jg4hv-jgkc8OvGel4cuItT1RG7MGoxBg/viewform" className="text-[#333333] font-[500] px-6 py-2 text-[15px] text-center border border-[#C4C4C4] ">Volunteer Now</Link>
        </div>
        <div className="max-lg:w-full">
            <Image src={vlt} alt='vlt' className='size-full'/>
        </div>
    </div>
  )
}

export default Volunteer