/* eslint-disable react/no-unescaped-entities */
"use client"
import gain from '@/public/gain.svg'
import gain1 from '@/public/gain1.svg'
import gain2 from '@/public/gain2.svg'
import gain3 from '@/public/gain3.svg'
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'

const Gain = () => {
    const [modal, setModal] = useState(false);
              const handleModalClick = (card) => {
                setModal(!modal);
              };
              
              const [formData, setFormData] = useState({
                      email: '',
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
                    toast.success('You have been added to the waitlist!', {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          });
                    setFormData({
                      email: '',
                    });
                  } else {
                    const errorMessage = data.message || data.error || JSON.stringify(data);
                    toast.error(`Failed to submit: ${errorMessage}`, {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          });
                  }
                } catch (error) {
                  console.error('Error submitting form:', error);
                  toast.error(`An error occurred: ${error.message}`, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                } finally {
                  setIsSubmitting(false);
                }
              };
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
            <button onClick={handleModalClick} className="primarybtn">Enroll for free</button>
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
            <ToastContainer />
            </>
        )}
    </>
  )
}

export default Gain