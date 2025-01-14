'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO, startOfWeek, endOfWeek } from 'date-fns';

export default function BlogContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
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
        const transformedPosts = Object.values(groupedByWeek)
          .map(({ weekStart, weekEnd, opportunities }) => {
            const types = [...new Set(opportunities.map(opp => opp.type))];
            
            // Find the first valid Cloudinary image URL
            const previewImage = opportunities.find(opp => 
              opp.imageUrl?.includes('res.cloudinary.com')
            )?.imageUrl || '/opp.svg';
            
            return {
              id: format(weekStart, 'yyyy-MM-dd'),
              weekStart,
              weekEnd,
              opportunities,
              count: opportunities.length,
              types,
              previewImage
            };
          })
          .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());

        setPosts(transformedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const optimizeCloudinaryUrl = (url) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    
    // Split the URL at /upload/
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    // Add optimization parameters
    return `${parts[0]}/upload/c_fill,f_auto,q_auto:best,w_800,h_450/${parts[1]}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 py-12">
      <div className="space-y-16">
        <header className="text-center">
          <h1 className="h2 text-gray-900">Weekly Opportunity Roundup</h1>
          <p className="mt-4 bt1 text-gray-600 max-w-3xl mx-auto">
            Stay updated with our weekly collection of opportunities in academia, research, and professional development.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link 
              href={`/blog/${format(post.weekStart, 'yyyy-MM-dd')}`}
              key={post.id}
              className="group border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <Image
                  src={optimizeCloudinaryUrl(post.previewImage)}
                  alt={`Week of ${format(post.weekStart, 'MMM d, yyyy')}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                  onError={(e) => {
                    e.currentTarget.src = '/opp.svg';
                  }}
                />
              </div>
              <time dateTime={format(post.weekStart, 'yyyy-MM-dd')} className="text-sm text-gray-500">
                Opportunities for {format(post.weekStart, 'MMMM d')} - {format(post.weekEnd, 'MMMM d, yyyy')}
              </time>
              <h2 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors capitalize">
                {post.types.join(', ')} Opportunities
              </h2>
              <p className="mt-2 text-gray-600">
                {post.count} opportunities this week
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}