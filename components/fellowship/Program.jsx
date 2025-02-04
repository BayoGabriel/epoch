/* eslint-disable react/no-unescaped-entities */
"use client"
import ps from '@/public/ps.svg'
import ps1 from '@/public/ps1.svg'
import ps2 from '@/public/ps2.svg'
import Image from 'next/image'
import Link from 'next/link'
import { MdNavigateNext } from 'react-icons/md'
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useState } from 'react'

const Program = () => {
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
      const handleModalClick = (card) => {
        setModal(!modal);
      };
      
      const [formData, setFormData] = useState({
              email: '',
              firstName: '',
              lastName: '',
              school: '',
              expectation: ''
          });
          
          const [isSubmitting, setIsSubmitting] = useState(false);
          
          const handleChange = (event) => {
              const { name, value } = event.target;
              setFormData((prevData) => ({
                  ...prevData,
                  [name]: value,
              }));
          };
          
        const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setIsSubmitting(true);

        try {
          const response = await fetch('https://api.sender.net/v2/subscribers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SENDER_API_KEY}`,
            },
            body: JSON.stringify({
              email: formData.email,
              groups: ['eVlqYB']
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            setTimeout(() => {
              setModal(false);
            }, 3000);
            toast.success('You have been added to the waitlist!');
            setFormData({
              email: '',
              firstName: '',
              lastName: '',
              school: '',
              expectation: ''
            });
          } else {
            const errorMessage = data.message || data.error || JSON.stringify(data);
            toast.error(`Failed to submit: ${errorMessage}`);
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error(`An error occurred: ${error.message}`);
        } finally {
          setLoading(false);
          setIsSubmitting(false);
        }
      };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
        <div id='program-structure' className='w-full flex-col flex items-center lg:gap-[48px] gap-[24px] justify-center max-lg:py-[40px] max-lg:px-4 px-[80px] py-[140px]'>
            <h2 className="h2">Program Structure</h2>
            <div className="w-full gap-[24px] max-lg:gap-[12px] flex flex-col">
                <div className="w-full flex pscard lg:gap-[65px] gap-[32px] items-start p-5 max-lg:p-2">
                    <Image className='max-lg:hidden' src={ps} alt='svg'/>
                    <div className="px-5 w-full max-lg:px-2">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex flex-col gap-[10px]">
                                <h4 className="h4">Discovery Phase</h4>
                                <div className="bg-[#00A699] px-[15px] py-[6px] rounded-[8px] text-white max-w-[95px]">2 weeks</div>
                            </div>
                            <Link target='_blank' href='https://docs.google.com/document/d/1EkSocAs3-oGCURtTuN9DStagPBZMFbnpEV2Dx-8x8ms/edit?tab=t.0#heading=h.6cvjyq84qj27' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
                                <span className=''>Learn More</span>
                                <MdNavigateNext className='mt-1'/>
                            </Link>
                        </div>
                        <p className="bt1 text-[#2E2E2E] mt-[25px]">Start by identifying your strengths, exploring career options, and selecting the right path for you. With guided self-assessments, career research, and expert consultations, you'll gain clarity on your professional journey.</p>
                    </div>
                </div>
                <div className="w-full flex pscard lg:gap-[65px] gap-[32px] items-start p-5 max-lg:p-2">
                    <Image className='max-lg:hidden' src={ps1} alt='svg'/>
                    <div className="px-5 w-full max-lg:px-2">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex flex-col gap-[10px]">
                                <h4 className="h4">Planning Phase</h4>
                                <div className="bg-[#00A699] px-[15px] py-[6px] rounded-[8px] text-white max-w-[95px]">2 weeks</div>
                            </div>
                            <Link target='_blank' href='https://docs.google.com/document/d/1EkSocAs3-oGCURtTuN9DStagPBZMFbnpEV2Dx-8x8ms/edit?tab=t.0#heading=h.6cvjyq84qj27' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
                                <span className=''>Learn More</span>
                                <MdNavigateNext className='mt-1'/>
                            </Link>
                        </div>
                        <p className="bt1 text-[#2E2E2E] mt-[25px]">Develop a personalized career plan, including short-term, mid-term, and long-term goals. Learn how to optimize your LinkedIn profile, build a professional network, and create an actionable roadmap to achieve your ambitions.</p>
                    </div>
                </div>
                <div className="w-full flex pscard lg:gap-[65px] gap-[32px] items-start p-5 max-lg:p-2">
                    <Image className='max-lg:hidden' src={ps2} alt='svg'/>
                    <div className="px-5 w-full max-lg:px-2">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex flex-col gap-[10px]">
                                <h4 className="h4">Implementation Phase</h4>
                                <div className="bg-[#00A699] px-[15px] py-[6px] rounded-[8px] text-white max-w-[95px]">2 weeks</div>
                            </div>
                            <Link target='_blank' href='https://docs.google.com/document/d/1EkSocAs3-oGCURtTuN9DStagPBZMFbnpEV2Dx-8x8ms/edit?tab=t.0#heading=h.6cvjyq84qj27' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
                                <span className=''>Learn More</span>
                                <MdNavigateNext className='mt-1'/>
                            </Link>
                        </div>
                        <p className="bt1 text-[#2E2E2E] mt-[25px]">Put your plan into action. Engage in workshops on networking, communication, leadership, and more. Complete projects relevant to your chosen field, build a professional portfolio and receive ongoing support from your mentors and peers.</p>
                    </div>
                </div>
            </div>
            <div className="p-4 flex items-center max-lg:flex-col justify-center gap-10 max-lg:gap-5">
                <button onClick={handleModalClick} className='primarybtn'>Enroll for free</button>
                <Link target='_blank' href="https://docs.google.com/document/d/1EkSocAs3-oGCURtTuN9DStagPBZMFbnpEV2Dx-8x8ms/edit?tab=t.0#heading=h.6cvjyq84qj27" className='psbtn bg-white'>Learn more about each phase</Link>
            </div>
        </div>
        {modal && (
            <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-[600px] my-6 mx-auto">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-10">
                    <div className="flex items-center justify-end mb-4">
                    <button onClick={() => setModal(false)} className="rounded-full size-[32px] hover:bg-slate-200">✕</button>
                    </div>
                    <div className="relative flex-grow flex flex-col items-center justify-center gap-4 max-lg:gap-2">
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-[34px] justify-center lg:px-[10px]">
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                        <h3 className="h3">Join Epoch Fellowship Waitlist</h3>
                        <p className="bt1">Be the first to know when the next cohort opens up</p>
                    </div>
                    <div className="w-full flex items-center gap-[24px] justify-center flex-col">
                        <div className="flex flex-col gap-3 w-full">
                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                            <label htmlFor="firstName" className="h4 text-black">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="Enter your first name"
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                            <label htmlFor="lastName" className="h4 text-black">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Enter your last name"
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="email" className="h4 text-black">Email Address</label>
                            <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email address"
                            className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="school" className="h4 text-black">School Name</label>
                            <input
                            type="text"
                            id="school"
                            name="school"
                            placeholder="Enter the name of your school"
                            className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                            value={formData.school}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="expectation" className="h4 text-black">Expectation of the Program</label>
                            <textarea
                            id="expectation"
                            name="expectation"
                            placeholder="Let us know here"
                            className="w-full h-[80px] p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                            value={formData.expectation}
                            onChange={handleChange}
                            required
                            />
                        </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4 items-center justify-center">
                        <button type="submit" className="primarybtn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                        </button>
                    </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        )}
    </>
  )
}

export default Program