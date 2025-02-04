'use client';

import Image from 'next/image';
import heroImage from '@/public/hero.png';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import logo from "@/public/epoch.svg";
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner'; // Assuming LoadingSpinner is a separate component

const Hero = () => {
    const [modal, setModal] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formRegisterData, setFormRegisterData] = useState({ 
      username: '', 
      email: '', 
      password: '', 
      school: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleModalClick = () => {
      setModal(!modal);
    };

    const closeModal = () => {
      setModal(false);
    };

    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setIsLoggingIn(true);
      
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Logged in successfully!');
          setModal(false);
          router.push('/dashboard');
          router.refresh();
        }
      } catch (error) {
        toast.error('An error occurred during login');
        console.error('Login error:', error);
      } finally {
        setIsLoggingIn(false);
      }
    };

    const handleRegisterSubmit = async (e) => {
      e.preventDefault();
      setIsRegistering(true);

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formRegisterData),
        });

        const data = await res.json();

        if (res.ok) {
          const result = await signIn('credentials', {
            redirect: false,
            email: formRegisterData.email,
            password: formRegisterData.password,
          });

          if (result?.error) {
            toast.error('Registration successful but login failed. Please try logging in.');
          } else {
            toast.success('Registration successful! Welcome to Epoch!');
            setModal(false);
            router.push('/dashboard');
            router.refresh();
          }
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } catch (error) {
        toast.error('An error occurred during registration');
        console.error('Registration error:', error);
      } finally {
        setIsRegistering(false);
      }
    };

    return (
      <>
        <div className='w-full bg-[#F5F5F5] flex max-md:flex-col-reverse mt-[83px] max-lg:mt-[62px] p-0'>
          <div className="flex items-center justify-center lg:w-[60%] w-full p-[60px] max-md:p-[20px] max-lg:p-[40px]">
            <div className="flex flex-col gap-[40px] max-lg:gap-[25px] max-lg:mb-10 max-lg:text-center h-full justify-center">
              <h1 className='h1'>
                <span className="text-[#E9672B]">Empowering You</span> as an Undergraduate to Build Your Future, Today
                <span className='text-accent'>.</span>
              </h1>
              <p className="bt1 lg:w-[80%]">
                Start your career journey while still in school with FREE resources, mentorship, and opportunities tailored just for you.
              </p>
              <div className="flex max-lg:flex-col max-lg:justify-center w-full max-lg:gap-[18px] items-center gap-[70px]">
                {!session ? (
                  <button onClick={handleModalClick} className="primarybtn">
                    Join Epoch Today
                  </button>
                ) : (
                  <Link href='#offerings' className='primarybtn'>Explore Offerings</Link>
                )}
                <Link href='/about' className="tbtn">
                  Learn more about Epoch
                </Link>
              </div>
            </div>
          </div>
          <div className='p-4 h-full flex lg:w-[40%] w-full items-center justify-center'>
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
                    <button onClick={closeModal} className="rounded-full size-[32px] hover:bg-slate-200">✕</button>
                  </div>
                  <div className="relative">
                    {showLoginForm ? (
                      <form onSubmit={handleLoginSubmit} className="w-full flex flex-col items-center gap-[56px] justify-center lg:px-[10px]">
                        <div className="w-full flex flex-col items-center justify-center gap-3 max-lg:gap-2">
                          <Image src={logo} alt="logo" className="w-[120px] h-[40px]" />
                          <h3 className="h3">Sign In to Epoch</h3>
                        </div>
                        <div className="w-full flex items-center gap-[32px] justify-center flex-col">
                          <div className="flex flex-col gap-3 w-full">
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="email" className="h4 text-black">Email address</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                required
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="password" className="h4 text-black">Password</label>
                              <div className="w-full relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  id="password"
                                  name="password"
                                  placeholder="Enter your password"
                                  value={formData.password}
                                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                  className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                  required
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
                          <button 
                            type="submit" 
                            className={`primarybtn ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoggingIn}
                          >
                            {isLoggingIn ? <span>Signing in...</span> : 'Sign In'}
                          </button>
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
                          <h3 className="h3">Create an Account</h3>
                        </div>
                        <div className="w-full flex items-center gap-[24px] justify-center flex-col">
                          <div className="flex flex-col gap-3 w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                              <div className="w-full flex flex-col gap-1">
                                <label htmlFor="username" className="h4 text-black">Full Name</label>
                                <input
                                  type="text"
                                  id="username"
                                  name="username"
                                  placeholder="Enter your full name"
                                  value={formRegisterData.username}
                                  onChange={(e) => setFormRegisterData({ ...formRegisterData, username: e.target.value })}
                                  className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                  required
                                />
                              </div>
                              <div className="w-full flex flex-col gap-1">
                                <label htmlFor="school" className="h4 text-black">School Name</label>
                                <input
                                  type="text"
                                  id="school"
                                  name="school"
                                  placeholder="Enter your school name"
                                  value={formRegisterData.school}
                                  onChange={(e) => setFormRegisterData({ ...formRegisterData, school: e.target.value })}
                                  className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                  required
                                />
                              </div>
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="email" className="h4 text-black">Email address</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formRegisterData.email}
                                onChange={(e) => setFormRegisterData({ ...formRegisterData, email: e.target.value })}
                                className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                required
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <label htmlFor="password" className="h4 text-black">Password</label>
                              <div className="w-full relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  id="password"
                                  name="password"
                                  placeholder="Create a password"
                                  value={formRegisterData.password}
                                  onChange={(e) => setFormRegisterData({ ...formRegisterData, password: e.target.value })}
                                  className="w-full p-[10px] border border-[#403D39CC] placeholder:text-[12px] rounded-[10px]"
                                  required
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
                          <button 
                            type="submit" 
                            className={`primarybtn ${isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isRegistering}
                          >
                            {isRegistering ? <span>Creating account...</span> : 'Create Account'}
                          </button>
                          <p className="text-[16px] inter font-[400]">
                            Already have an account?{" "}
                            <button
                              type="button"
                              onClick={() => setShowLoginForm(true)}
                              className="text-[#3777FF] font-[900]"
                            >
                              Sign In
                            </button>
                          </p>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
};

export default Hero;