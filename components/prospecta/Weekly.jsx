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
            <div className='w-full flex flex-col gap-[32px]'>
                <div className='flex justify-between items-center'>
                    <h3 className='h3'>Weekly News</h3>
                    <Link href='/blog' className='flex items-center gap-[4px] text-primary'>
                        View All
                        <MdNavigateNext className='mt-1'/>
                    </Link>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {weeklyPosts.map((post) => (
                        <Link 
                            href={`/blog/${format(post.weekStart, 'yyyy-MM-dd')}`}
                            key={post.id}
                            className="group"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {post.images.map((image, index) => (
                                    <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`Opportunity ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                            <h2 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                Opportunities for {` ${format(post.weekStart, 'MMM d, yyyy')}`}
                            </h2>
                            <p className="mt-2 text-gray-600">
                                {post.count} opportunities this week
                            </p>
                        </Link>
                    ))}
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Weekly;
