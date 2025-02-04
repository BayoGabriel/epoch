/* eslint-disable react/no-unescaped-entities */
"use client"
import { useState } from 'react'
import fellm from '@/public/fellm.png'
import fell from '@/public/fell.png'
import Image from 'next/image'
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';

const Fellowship = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    expectation: '',
  });

  const handleModalClick = (card) => {
    setModal(!modal);
  };

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

    try {
      const response = await fetch('https://api.sender.net/v2/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SENDER_API_KEY}`,
        },
        body: JSON.stringify({
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          customFields: {
            school: formData.school,
            expectation: formData.expectation,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          setModal(false);
        }, 3000);
        toast.success('You have been added to the waitlist!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          school: '',
          expectation: '',
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
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className='w-full flex justify-between'>
        <div className="w-[4%] flex items-start justify-center max-lg:hidden">
        <span className="text-accent rounded-full bg-accent size-[24px]"></span>
        </div>
        <div className="lg:w-[96%] w-full bg-black rounded-l-[16px] max-lg:rounded-[16px] flex items-start justify-between max-lg:flex-col">
            <div className="w-full flex items-start justify-end lg:hidden">
            <Image src={fellm} alt='f' className=''/>
            </div>
            <div className="p-[80px] max-lg:px-4 max-lg:py-10 flex flex-col items-start max-lg:items-center">
                <h2 className="h2 text-white mb-[30px]">Fellowship Program Update</h2>
                <h6 className="mb-4 max-lg:mb-[14px] text-white font-[400] abouthero text-[24px] max-lg:text-[16px] max-lg:text-center">Applications is Closed for Cohort 2</h6>
                <p className="bt1 text-[#DCDEE1] mb-[30px] lg:w-[341px] max-lg:text-center">Click on the link below to join the wait list for the next cohort and take the next step in your career journey.</p>
                <button onClick={handleModalClick} className="primarybtn">Join Waitlist</button>
            </div>
            <Image src={fell} alt='jx' className='h-full max-lg:hidden'/>
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
                    <button type="submit" className="primarybtn" disabled={loading}>
                      {loading ? 'Submitting...' : 'Join Waitlist'}
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

export default Fellowship