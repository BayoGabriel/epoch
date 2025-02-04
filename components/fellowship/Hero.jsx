/* eslint-disable react/no-unescaped-entities */
"use client"
import heroImage from '@/public/fellhero.png'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useState } from 'react'
const Hero = () => {
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        school: '',
        expectation: ''
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
                    groups: ['eVlqYB']
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

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
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

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
                        <button onClick={handleModalClick} className="primarybtn">
                        Enroll for free
                        </button>
                        <Link href='/fellowship#program-structure' className="tbtn">
                        Learn more about the program
                        </Link>
                    </div>
                </div>
                </div>
                <div className='p-4 h-full flex lg:w-[50%] w-full items-center justify-center'>
                    <Image src={heroImage} alt='hero' className='w-full'/>
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

export default Hero