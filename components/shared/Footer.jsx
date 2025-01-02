"use client"
import Image from 'next/image'
import logo from '@/public/epoch.svg'
import Link from 'next/link'
import { FaInstagram, FaLinkedinIn, FaSpotify, FaTwitter, FaYoutube } from 'react-icons/fa'
import { TfiFacebook } from "react-icons/tfi";
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Footer = () => {
    const [formData, setFormData] = useState({
        name: '',
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
                    groups: ['erXrJB'],
                    fields: {
                        name: formData.name
                    }
                }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
                toast.success('You have been added to the newsletter!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setFormData({
                    name: '',
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
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='w-full mt-[80px] max-lg:py-[40px] max-lg:px-10 px-20 max-lg:hidden'>
                <div className="w-full flex items-start justify-between pr-20 border-b border-b-[#E2E8F0] pb-[80px] max-lg:pb-[40px]">
                    <div className="">
                        <Image src={logo} alt='logo' className='lg:w-[120px]'/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h6 className="text-accent font-[500] roboto text-[15px]">EXPLORE</h6>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='/'>Home</Link>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='/'>Blog</Link>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='https://open.spotify.com/show/26oCnoZaWz98tIE6u7WwiI?si=Jpk97VF4RdmWR-kPkVh8Ng'>Podcast</Link>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='/'>Webinars</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h6 className="text-accent font-[500] roboto text-[15px] uppercase">Learn More</h6>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='/prospecta'>Prospecta by Epoch</Link>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='/fellowship'>Fellowship Program</Link>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='/ambassadors'>Ambassadorship Program</Link>
                        <Link className='text-[#0F172A] font-[400] text-[16px]' href='/about'>About Us</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h6 className="text-accent h4 uppercase">Subscribe to our newsletter</h6>
                        <form onSubmit={handleSubmit} className='flex flex-col'>
                            <div className="flex flex-col gap-1 mb-4">
                                <label className='text-[#0F172A] font-[400] text-[16px]' htmlFor="name">Name</label>
                                <input 
                                    type="text" 
                                    name='name' 
                                    placeholder='Enter your name' 
                                    className='border border-[#D4D4D4] rounded-[12px] placeholder:text-[#959595] placeholder:text-[14px] placeholder:font-[400] py-2 px-4 focus:outline-none appearance-none'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-[#0F172A] font-[400] text-[16px]' htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    name='email' 
                                    placeholder='Enter your email' 
                                    className='border border-[#D4D4D4] rounded-[12px] placeholder:text-[#959595] placeholder:text-[14px] placeholder:font-[400] py-2 px-4 focus:outline-none appearance-none'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="">
                                <button type="submit" className="mt-6 primarybtn text-center" disabled={isSubmitting}>
                                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between py-[48px]">
                    <span className='text-[16px] font-[400] text-[#0F172A]'>@ 2024 admin@epochafrica.com</span>
                    <div className="flex items-center justify-center gap-8">
                        <div className="flex gap-2 p-0">
                            <Link href='' className='text-[#475569] text-[16px] font-[400]'>Terms</Link>
                            <Link href='' className='text-[#475569] text-[16px] font-[400]'>Privacy</Link>
                            <Link href='' className='text-[#475569] text-[16px] font-[400]'>Contact</Link>
                        </div>
                        <div className="flex gap-2 p-0">
                            <Link href='' className='text-[#0F172A] mt-1'><FaYoutube/></Link>
                            <Link href='' className='text-[#0F172A] mt-1'><TfiFacebook/></Link>
                            <Link href='' className='text-[#0F172A] mt-1'><FaTwitter/></Link>
                            <Link href='' className='text-[#0F172A] mt-1'><FaInstagram/></Link>
                            <Link href='' className='text-[#0F172A] mt-1'><FaLinkedinIn/></Link>
                            <Link href='' className='text-[#0F172A] mt-1'><FaSpotify /></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:hidden flex flex-col justify-center items-center w-full mt-10 p-[60px] max-md:p-10">
                <div className="flex flex-col gap-3 w-full">
                    <h6 className="text-accent font-[500] h4 text-[15px] uppercase">Subscribe to our newsletter</h6>
                    <form onSubmit={handleSubmit} className='flex flex-col items-center w-full'>
                        <div className="flex flex-col gap-1 mb-4">
                            <label className='text-[#0F172A] font-[400] text-[16px]' htmlFor="name">Name</label>
                            <input 
                                type="text" 
                                name='name' 
                                placeholder='Enter your name' 
                                className='border border-[#D4D4D4] rounded-[12px] placeholder:text-[#959595] placeholder:text-[14px] placeholder:font-[400] py-2 w-full px-4 focus:outline-none appearance-none'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className='text-[#0F172A] font-[400] text-[16px]' htmlFor="email">Email</label>
                            <input 
                                type="email"
                                id="email"
                                name="email" 
                                placeholder='Enter your email' 
                                value={formData.email} 
                                onChange={handleChange} 
                                required
                                className='border border-[#D4D4D4] rounded-[12px] placeholder:text-[#959595] placeholder:text-[14px] placeholder:font-[400] py-2 w-full px-4 focus:outline-none appearance-none'
                            />
                        </div>
                        <div className="">
                            <button type='submit' className="mt-6 primarybtn text-center" disabled={isSubmitting}>
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="mt-10 mb-6">
                    <Image src={logo} alt='logo' className='h-[34px]'/>
                </div>
                <div className="w-full flex flex-col gap-6">
                    <div className="flex justify-between">
                        <Link href='' className='text-[#475569] text-[16px] font-[400]'>Terms</Link>
                        <Link href='' className='text-[#475569] text-[16px] font-[400]'>Privacy</Link>
                        <Link href='' className='text-[#475569] text-[16px] font-[400]'>Contact</Link>
                    </div>
                    <div className="flex justify-between">
                        <Link href='' className='text-[#0F172A] mt-1'><FaYoutube/></Link>
                        <Link href='' className='text-[#0F172A] mt-1'><TfiFacebook/></Link>
                        <Link href='' className='text-[#0F172A] mt-1'><FaTwitter/></Link>
                        <Link href='' className='text-[#0F172A] mt-1'><FaInstagram/></Link>
                        <Link href='' className='text-[#0F172A] mt-1'><FaLinkedinIn/></Link>
                        <Link href='' className='text-[#0F172A] mt-1'><FaSpotify /></Link>
                    </div>
                    <span className='text-[16px] text-center text-nowrap font-[400] text-[#0F172A]'>@ 2024 admin@epochafrica.com</span>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Footer