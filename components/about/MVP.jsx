/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import mission from '@/public/mvpbg.png'
import ab from '@/public/ab.png'
import esha from '@/public/esha.png'
import shay from '@/public/shay.png'
import leeshan from '@/public/leeshan.png'
import arumoy from '@/public/arumoy.png'
import monir from '@/public/monir.png'
import harriet from '@/public/harriet.png'
import sowe from '@/public/sowe.jpeg'
import gboye from '@/public/gboye.png'
import Link from 'next/link'
import { FaLinkedin } from 'react-icons/fa6'

const MVP = () => {
  return (
    <>
        <div className="w-full relative overflow-hidden my-20 max-lg:my-10 max-lg:hidden">
            <Image src={mission} alt='mission' className='w-full h-full'/>
            <div className="w-full mvp absolute h-full top-0 left-0"></div>
            <div className="flex flex-col gap-10 absolute w-[367px] max-lg:w-[141px] top-[56px] left-[56px] max-lg:top-2 max-lg:left-2 text-white">
            <h3 className="h2">The real MVPs</h3>
            <p className="bt1">Celebrating Volunteers who have given their time to Epoch's success to date</p>
            </div>
            <div className="bg-[#F7F6FA] absolute top-20 lg:w-[184px] right-1/4 p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={harriet} alt='harriet'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Harriet</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/harriet-johnson-4b6815116/"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[160px] lg:w-[184px] right-[10%] p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={shay} alt='harriet'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Shay</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/shaygu/"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[220px] lg:w-[184px] right-[33%] p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={esha} alt='harriet'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Esha</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/eshachidgopkar27/"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[300px] lg:w-[184px] right-[18%] p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={monir} alt='harriet'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Monir</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/monirjahangiri/"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[350px] lg:w-[184px] right-[41%] p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={leeshan} alt='harriet'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Leeshan</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/leeshan-lian/"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[430px] lg:w-[184px] right-[26%] p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={arumoy} alt='harriet'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Arumoy</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/arumoy-dey-8a461720/"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[510px] lg:w-[184px] right-[11%] p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={sowe} className='rounded-full h-[64px] w-[64px]' alt='harriet'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Malik</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/abdulmalik-amzat-a0647321b/"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] overflow-hidden absolute top-[380px] lg:w-[184px] right-[3%] p-[21px] rounded-[21px] flex items-center gap-[10px]">
                <Image src={gboye} alt='harriet' className='rounded-full h-[64px] w-[64px]'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Ayoola</h6>
                    <Link target='_blank' href="https://ng.linkedin.com/in/adegboyega-ayoola-5699aa339"><FaLinkedin className='size-[26px] text-[#0A66C2]'/></Link>
                </div>
            </div>
        </div>
        <div className="lg:hidden relative my-10">
            <Image src={ab} alt='ab' className='w-full h-[532px]'/>
            <div className="absolute absh h-full w-full top-0 left-0"></div>
            <div className="flex flex-col gap-5 absolute w-[269px] top-[39px] left-[39px] text-white">
                <h3 className="h2">The real MVPs</h3>
                <p className="bt1">Celebrating Volunteers who have given their time to Epoch's success to date</p>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[45%] right-[33%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={harriet} alt='harriet' className='size-[30px]'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Harriet</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/harriet-johnson-4b6815116/"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[43%] left-[3%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={shay} alt='harriet' className='size-[30px]'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Shay</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/shaygu/"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[48%] right-[2%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={esha} alt='harriet' className='size-[30px]'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Esha</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/eshachidgopkar27/</div>"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[30%] right-[45%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={arumoy} alt='harriet' className='size-[30px]'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Arumoy</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/arumoy-dey-8a461720/"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[60%] left-[3%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={monir} alt='harriet' className='size-[30px]'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Monir</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/monirjahangiri/"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[65%] left-[40%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={gboye} alt='harriet' className='size-[30px] rounded-full'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Ayoola</h6>
                    <Link target='_blank' href="https://ng.linkedin.com/in/adegboyega-ayoola-5699aa339"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[80%] left-[20%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={leeshan} alt='harriet' className='size-[30px]'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Leeshan</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/leeshan-lian/"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
            <div className="bg-[#F7F6FA] absolute top-[78%] right-[10%] p-[10px] rounded-[21px] flex items-center gap-[5px]">
                <Image src={sowe} alt='harriet' className='size-[30px] rounded-full'/>
                <div className="flex flex-col gap-1">
                    <h6 className="h4">Malik</h6>
                    <Link target='_blank' href="https://www.linkedin.com/in/abdulmalik-amzat-a0647321b/"><FaLinkedin className='size-[10px] text-[#0A66C2]'/></Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default MVP