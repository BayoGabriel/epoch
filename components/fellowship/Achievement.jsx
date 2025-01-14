import parti from '@/public/parti.svg'
import cohort from '@/public/cohort.svg'
import Image from 'next/image'

const Achievement = () => {
  return (
    <div className='w-full bg-black flex max-lg:flex-col max-lg:gap-10 items-center justify-center lg:justify-between px-[100px] py-10'>
        <h2 className='h2 text-white'>Our Achievements</h2>
        <div className="flex items-center gap-[96px] max-lg:w-full max-md:flex-col max-md:gap-10 lg:justify-between">
            <Image src={cohort} alt='image'/>
            <Image src={parti} alt='image'/>
        </div>
    </div>
  )
}

export default Achievement