/* eslint-disable react/no-unescaped-entities */
"use client"
import Image from 'next/image'
import heroImage from '@/public/hero.png'
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import logo from "@/public/epoch.svg";
import { signIn } from 'next-auth/react';


const Hero = () => {
    const [modal, setModal] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formRegisterData, setFormRegisterData] = useState({ username: '', email: '', password: '', school: '' });
    const [error1, setError1] = useState(null);
    const { data: session } = useSession();

    const handleModalClick = (card) => {
      setModal(!modal);
    };
    const closeModal = () => {
      setModal(false);
    };
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
  
      if (res.ok) {
        // Redirect to the dashboard after successful login
        router.push('/dashboard');
        setModal(false);
      } else {
        setError('Invalid credentials');
      }
    };
    const handleRegisterSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formRegisterData),
        });
  
        const data = await res.json();
        if (res.status === 201) {
          setShowLoginForm(true)
        } else {
          setError1(data.message);
        }
      } catch (error1) {
        setError1('Something went wrong. Please try again.');
      }
    };

  return (
    <> 
        <div className='w-full bg-[#F5F5F5] flex max-lg:flex-col-reverse mt-[83px] max-lg:mt-[62px] p-0'>
            <div className="flex items-center justify-center lg:w-[60%] w-full p-[60px] max-md:p-[20px] max-lg:p-[40px]">
            <div className="flex flex-col gap-[40px] max-lg:gap-[25px] max-lg:mb-10  max-lg:text-center h-full justify-center">
                <h1 className='h1'> <span className="text-[#E9672B]">Empowering You</span> as an Undergraduate to Build Your Future, Today<span className='text-accent'>.</span></h1>
                <p className="bt1 lg:w-[80%]">
                Start your career journey while still in school with FREE resources, mentorship, and opportunities tailored just for you.
                </p>
                <div className="flex max-lg:flex-col max-lg:justify-center w-full max-lg:gap-[18px] items-center gap-[70px]">
                    {!session? (
                      <button onClick={handleModalClick} className="primarybtn">
                        Join Epoch Today
                      </button>
                    ) : (
                      <span className='primarybtn'>Hey, {session.user.username}</span>
                    )}
                    <Link href='/about' className="tbtn">
                    Learn more about Epoch
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
            <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed h-screen inset-0 z-50 outline-none focus:outline-none">
              <div className="w-full h-full absolute top-0 bg-black opacity-25 max-lg:hidden"></div>
              <div className="absolute h-full top-0 w-[720px] max-lg:w-full">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col h-full top-0 bottom-0 right-0 w-full bg-white outline-none focus:outline-none p-10">
                  <div className="flex items-center justify-end">
                    <button onClick={closeModal} className="rounded-full size-[32px] hover:bg-slate-200">
                      ✕
                    </button>
                  </div>
                  <div className="relative">
                    {showLoginForm ? (
                      <form onSubmit={handleLoginSubmit} className="w-full flex flex-col items-center gap-[56px] justify-center lg:px-[10px]">
                        <div className="w-full flex flex-col items-center justify-center gap-3 max-lg:gap-2">
                          <Image src={logo} alt="logo" className="w-[120px] h-[40px]" />
                          <h3 className="h3">Sign In to Epoch</h3>
                        </div>
                        <div className="w-full flex items-center gap-[32px] justify-center flex-col">
                          <button className="flex items-center gap-8 p-3 border-[#403D39CC] border rounded-[30px] w-full justify-center">
                            <FcGoogle />
                            <span>Continue with Google</span>
                          </button>
                          <div className="w-full flex items-center gap-4">
                            <hr className="flex-grow border-t-1 border-black" />
                            <span className="px-2 text-black">or</span>
                            <hr className="flex-grow border-t-1 border-black" />
                          </div>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="email" className="h4 text-black">Email address</label>
                              <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="password" className="h4 text-black">Password</label>
                              <div className="w-full relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              />
                              <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-4 items-center justify-center">
                          <button type="submit" className="primarybtn">
                            Sign In
                          </button>
                          {error && <p className="text-red-500">{error}</p>}
                          <p className="text-[16px] inter font-[400]">
                            Don't have an account?{" "}
                            <button
                              type="button"
                              onClick={() => setShowLoginForm(false)}
                              className="text-[#3777FF] font-[900]"
                            >
                              Sign Up
                            </button>
                          </p>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col items-center gap-[34px] justify-center lg:px-[10px]">
                        <div className="w-full flex flex-col items-center justify-center gap-3 max-lg:gap-2">
                          <Image src={logo} alt="logo" className="w-[120px] h-[40px]" />
                          <h3 className="h3">Sign Up to Join Epoch</h3>
                        </div>
                        <div className="w-full flex items-center gap-[24px] justify-center flex-col">
                          <button className="flex items-center gap-8 p-3 border-[#403D39CC] border rounded-[30px] w-full justify-center">
                            <FcGoogle />
                            <span>Continue with Google</span>
                          </button>
                          <div className="w-full flex items-center gap-4">
                            <hr className="flex-grow border-t-1 border-black" />
                            <span className="px-2 text-black">or</span>
                            <hr className="flex-grow border-t-1 border-black" />
                          </div>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="h4 text-black">First Name</label>
                                <input
                                  type="text"
                                  name="firstName"
                                  placeholder="Enter your first name"
                                  className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                  value={formRegisterData.username}
                                  onChange={(e) => setFormRegisterData({ ...formRegisterData, username: e.target.value })}
                                />
                              </div>
                              <div className="w-full flex flex-col gap-1">
                                <label htmlFor="email" className="h4 text-black">Last Name</label>
                                <input
                                  type="text"
                                  name="lastname"
                                  placeholder="Enter your last name"
                                  className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                  value={formRegisterData.school}
                                  onChange={(e) => setFormRegisterData({ ...formRegisterData, school: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="email" className="h4 text-black">Email address</label>
                              <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                value={formRegisterData.email}
                                onChange={(e) => setFormRegisterData({ ...formRegisterData, email: e.target.value })}
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="password" className="h4 text-black">Password</label>
                              <div className="w-full relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                value={formRegisterData.password}
                                onChange={(e) => setFormRegisterData({ ...formRegisterData, password: e.target.value })}
                              />
                              <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[14px] cursor-pointer text-gray-500"
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-4 items-center justify-center">
                          <button type="submit" className="primarybtn">
                            Sign Up
                          </button>
                          {error && <p className="text-red-500">{error}</p>}
                          <p className="text-[16px] inter font-[400]">
                            Don't have an account?{" "}
                            <button
                              type="button"
                              onClick={() => setShowLoginForm(true)}
                              className="text-[#3777FF] font-[900]"
                            >
                              Sign in
                            </button>
                          </p>
                        </div>
                        {error1 && <p>{error1}</p>}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  )
}

export default Hero