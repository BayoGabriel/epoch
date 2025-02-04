'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import opp from '@/public/opp.svg';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function BlogContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/opportunities/main?status=approved');
        const opportunities = await response.json();

        // Group by week
        const groupedByWeek = opportunities.reduce((acc, opportunity) => {
          const date = parseISO(opportunity.dateCreated);
          const weekKey = format(date, 'yyyy-MM-dd');

          if (!acc[weekKey]) {
            acc[weekKey] = {
              opportunities: [],
              images: new Set(),
            };
          }
          acc[weekKey].opportunities.push(opportunity);
          if (opportunity.imageUrl) {
            acc[weekKey].images.add(opportunity.imageUrl);
          }
          return acc;
        }, {});

        // Transform into posts
        const transformedPosts = Object.entries(groupedByWeek)
          .map(([weekKey, data]) => ({
            id: weekKey,
            date: parseISO(weekKey),
            opportunities: data.opportunities,
            images: Array.from(data.images),
            count: data.opportunities.length,
          }))
          .sort((a, b) => b.date - a.date);

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
    return <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner/>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-16">
        <header className="text-center">
          <h1 className="h1 text-gray-900">Weekly Opportunity Roundup</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our weekly collection of opportunities in academia, research, and professional development.
          </p>
        </header>

        <div className="grid gap-12">
          {posts.map((post) => (
            <article key={post.id} className="group relative">
              <div className="relative">
                {post.images.length > 0 ? (
                  post.images.length >= 4 ? (
                    <div className="grid grid-cols-2 gap-2 aspect-[2/1] rounded-lg overflow-hidden">
                      {post.images.slice(0, 4).map((image, idx) => (
                        <div key={idx} className="relative aspect-square">
                          <Image
                            src={image}
                            alt={`Week of ${format(post.date, 'MMMM do, yyyy')} image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-[2/1] rounded-lg overflow-hidden">
                      <Image
                        src={post.images[0]}
                        alt={`Week of ${format(post.date, 'MMMM do, yyyy')}`}
                        width={1200}
                        height={600}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )
                ) : (
                  <div className="aspect-[2/1] rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={opp}
                      alt="Default opportunity image"
                      width={1200}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3">
                  <time dateTime={post.id} className="text-gray-500">
                    {format(post.date, 'MMMM do, yyyy')}
                  </time>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{post.count} opportunities</span>
                </div>
                <h2 className="mt-4 h3 text-gray-900 group-hover:text-gray-600">
                  <Link href={`/blog/${post.id}`}>
                    Opportunities for the Week of {format(post.date, 'MMMM do, yyyy')}
                  </Link>
                </h2>
                <p className="mt-4 bt1 text-gray-600">
                  Discover {post.count} new opportunities this week, including positions at{' '}
                  {post.opportunities
                    .slice(0, 3)
                    .map(opp => opp.institution)
                    .join(', ')}
                  {post.opportunities.length > 3 && ' and more'}.
                </p>
                <div className="mt-6">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-primary hover:text-primary/80 font-semibold"
                  >
                    Read full post →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
