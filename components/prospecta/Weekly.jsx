'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import fete from '@/public/fete.png';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

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
                const response = await fetch('/api/opportunities/main?status=approved');
                const opportunities = await response.json();

                // Group by week using startOfWeek
                const groupedByWeek = opportunities.reduce((acc, opportunity) => {
                    const date = parseISO(opportunity.dateCreated);
                    const weekStart = startOfWeek(date);
                    const weekKey = format(weekStart, 'yyyy-MM-dd');

                    if (!acc[weekKey]) {
                        acc[weekKey] = {
                            weekStart,
                            weekEnd: endOfWeek(weekStart),
                            opportunities: []
                        };
                    }
                    acc[weekKey].opportunities.push(opportunity);
                    return acc;
                }, {});

                // Transform into weekly posts
                const posts = Object.values(groupedByWeek)
                    .map(({ weekStart, weekEnd, opportunities }) => {
                        const types = [...new Set(opportunities.map(opp => opp.type))];
                        const images = opportunities.slice(0, 4).map(opp => opp.imageUrl || '/opp.svg');
                        
                        return {
                            id: format(weekStart, 'yyyy-MM-dd'),
                            weekStart,
                            weekEnd,
                            opportunities,
                            count: opportunities.length,
                            types,
                            images,
                        };
                    })
                    .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
                    .slice(0, 4);

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
                    list_ids: [process.env.NEXT_PUBLIC_SENDER_LIST_ID],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

            toast.success('Successfully subscribed to weekly opportunities!');
            setFormData({ email: '' });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full'>
            <div className='w-full lg:p-[80px] p-2 flex flex-col gap-[32px]'>
                <div className="w-full flex items-center justify-center flex-col gap-4">
                    <h2 className="h2 text-center">Weekly Newsletter Archive</h2>
                    <form onSubmit={handleSubmit} className='flex items-center gap-2 w-full lg:hidden'>
                                <input 
                                    type="email" 
                                    name='email' 
                                    placeholder='Enter your email' 
                                    className='border border-[#D4D4D4] rounded-[12px] min-w-[187px] placeholder:text-[#959595] placeholder:text-[10px] placeholder:font-[400] py-2 px-4 focus:outline-none appearance-none'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit" className="px-[11px] rounded-[5px] text-[10px] text-nowrap py-[8px] text-white bg-primary text-center" disabled={isSubmitting}>
                                    {isSubmitting ? 'Subscribing...' : 'Sign up'}
                                </button>
                    </form>
                    <form onSubmit={handleSubmit} className='flex items-center gap-10 max-lg:hidden'>
                                <input 
                                    type="email" 
                                    name='email' 
                                    placeholder='Enter your email to get weekly opportunities' 
                                    className='border border-[#D4D4D4] rounded-[12px] w-[397px] placeholder:text-[#959595] placeholder:text-[14px] placeholder:font-[400] py-4 px-6 focus:outline-none appearance-none'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit" className="primarybtn text-center" disabled={isSubmitting}>
                                    {isSubmitting ? 'Subscribing...' : 'Sign up to newsletters'}
                                </button>
                    </form>
                </div>
                <div className='flex justify-between items-center'>
                    <span className='span'></span>
                    <Link href='/blog' className='flex items-center gap-[4px] h4'>
                        View All
                        <MdNavigateNext className='mt-1'/>
                    </Link>
                </div>
                <div className="grid py-6 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {weeklyPosts.map((post) => (
                        <div
                            key={post.id}
                            className="shadow-md rounded-lg"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {post.images.map((image, index) => (
                                    <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`${index + 1}`}
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="w-full flex flex-col gap-4 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                                <h2 className="mt-2 h4 text-gray-900 group-hover:text-primary transition-colors">
                                    Opportunities for {` ${format(post.weekStart, 'MMM d, yyyy')}`}
                                </h2>
                                <p className="my-2 bt2 text-gray-600">
                                We have {post.count} opportunities this week, please pay attention to the deadlines.
                                </p>
                                <div className="w-full py-4"><Link href={`/blog/${format(post.weekStart, 'yyyy-MM-dd')}`} className='px-4 py-2 bg-white text-black border border-black  rounded text-center mt-4'>Read Now</Link></div>
                            </div>
                        </div>
                    ))}
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Weekly;
