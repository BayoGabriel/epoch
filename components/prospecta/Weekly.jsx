"use client"
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { MdNavigateNext } from 'react-icons/md'
import fete from '@/public/fete.png'
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startOfWeek, endOfWeek, format, parseISO, subWeeks } from 'date-fns';
import opp from '@/public/opp.svg';

const Weekly = () => {
    const [formData, setFormData] = useState({
        email: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [weeklyPosts, setWeeklyPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeeklyOpportunities = async () => {
            try {
                // Fetch approved opportunities
                const response = await fetch('/api/opportunities/main?status=approved');
                const opportunities = await response.json();

                // Group opportunities by week
                const groupedByWeek = opportunities.reduce((acc, opportunity) => {
                    const date = parseISO(opportunity.dateCreated);
                    const weekStart = startOfWeek(date);
                    const weekKey = format(weekStart, 'yyyy-MM-dd');

                    if (!acc[weekKey]) {
                        acc[weekKey] = [];
                    }
                    acc[weekKey].push(opportunity);
                    return acc;
                }, {});

                // Transform into weekly posts
                const posts = Object.entries(groupedByWeek)
                    .map(([weekKey, opportunities]) => {
                        const weekStart = parseISO(weekKey);
                        const weekEnd = endOfWeek(weekStart);
                        
                        // Get up to 4 images from the opportunities
                        const images = opportunities
                            .filter(opp => opp.imageUrl)
                            .map(opp => opp.imageUrl)
                            .slice(0, 4);
                        
                        // If we don't have enough images, pad with the default
                        while (images.length < 4) {
                            images.push(opp);
                        }

                        return {
                            id: weekKey,
                            weekStart,
                            weekEnd,
                            opportunities,
                            images,
                            count: opportunities.length
                        };
                    })
                    .sort((a, b) => b.weekStart - a.weekStart) // Most recent first
                    .slice(0, 4); // Show last 4 weeks

                setWeeklyPosts(posts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoading(false);
            }
        };

        fetchWeeklyOpportunities();
    }, []);

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
                    groups: ['erXrJB']
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

    if (loading) {
        return <div className="w-full flex justify-center items-center py-8">Loading...</div>;
    }

    return (
        <>
            <div id='newsletter' className="w-full max-lg:p-6 lg:p-[120px] flex flex-col items-center justify-center">
                <div className="flex flex-col gap-10 max-lg:gap-4 items-center justify-center">
                    <h2 className="h2">Weekly Newsletter Archive</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="w-full max-lg:flex gap-2 lg:space-x-[30px]">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className='px-5 lg:w-[331px] py-[15px] max-lg:px-[10px] max-lg:py-1 max-lg:bt2 max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent h-[50px] placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="bg-primary text-white h-[50px] max-lg:h-[31px] py-[10px] text-nowrap px-6 text-[16px] font-[900] rounded-[8px] max-lg:hidden" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Sign up to newsletters'}
                            </button>
                            <div className="w-full lg:hidden">
                                <button type="submit" className="bg-primary h-full w-full text-white py-[10px] max-lg:py-2 max-lg:px-[15px] text-nowrap px-6 text-[10px] font-[900] rounded-[8px]" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Sign up'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="w-full flex items-end justify-end my-8">
                    <Link href='/blog' className='font-[900] underline max-lg:hidden text-[16px] flex items-center gap-2'>
                        <span className=''>View More</span>
                        <MdNavigateNext className='mt-1'/>
                    </Link>
                </div>
                <div className="w-full grid-cols-4 grid max-lg:grid-cols-1 gap-3">
                    {weeklyPosts.map((post) => (
                        <div key={post.id} className="flex flex-col flex-grow rncard rounded-[8px] border border-[#DCDEE1] p-0">
                            {/* Image section with conditional rendering */}
                            {post.images.length > 0 && (
                                post.images.length >= 4 ? (
                                    <div className="grid grid-cols-2 gap-1 p-1">
                                        {post.images.slice(0, 4).map((imageUrl, index) => (
                                            <div key={index} className="aspect-square relative overflow-hidden">
                                                <Image 
                                                    src={imageUrl} 
                                                    alt={`Week ${format(post.weekStart, 'MMM do')} image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="aspect-video relative overflow-hidden">
                                        <Image 
                                            src={post.images[0]} 
                                            alt={`Week of ${format(post.weekStart, 'MMM do, yyyy')}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )
                            )}
                            <div className="w-full flex flex-col flex-grow gap-[22px] px-4 pt-3 lg:px-6 lg:pt-4 pb-10">
                                <h4 className="h4 text-[#242424]">
                                    Opportunities for the week ({format(post.weekStart, 'do MMMM, yyyy')})
                                </h4>
                                <p className="bt1 text-[#2E2E2E]">
                                    We have {post.count} {post.count === 1 ? 'opportunity' : 'opportunities'} this week, 
                                    please pay attention to the deadlines.
                                </p>
                                <div className="">
                                    <Link 
                                        href={`/blog/${format(post.weekStart, 'yyyy-MM-dd')}`}
                                        className="inline-block border py-[6px] px-[15px] border-[#DCDEE1] rounded-[8px] rn hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Read Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <ToastContainer />
            </div>
        </>
    )
}

export default Weekly
