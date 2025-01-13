'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import opp from '@/public/opp.svg';

export default function BlogPostContent({ weekId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch('/api/opportunities/main?status=approved');
        const opportunities = await response.json();

        // Filter opportunities for this week
        const weekStart = parseISO(weekId);
        const weekOpportunities = opportunities.filter(opp => {
          const oppDate = parseISO(opp.dateCreated);
          return format(oppDate, 'yyyy-MM-dd') === weekId;
        });

        // Group opportunities by type
        const groupedOpportunities = weekOpportunities.reduce((acc, opp) => {
          if (!acc[opp.type]) {
            acc[opp.type] = [];
          }
          acc[opp.type].push(opp);
          return acc;
        }, {});

        setPost({
          date: weekStart,
          opportunities: weekOpportunities,
          groupedOpportunities,
          images: weekOpportunities
            .filter(opp => opp.imageUrl)
            .map(opp => opp.imageUrl),
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [weekId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!post || post.opportunities.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="h2 text-gray-900">No opportunities found for this week</h1>
          <Link href="/blog" className="mt-8 inline-block text-primary hover:text-primary/80">
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="text-primary hover:text-primary/80">
        ← Back to all posts
      </Link>

      <header className="mt-8 text-center">
        <time dateTime={weekId} className="text-gray-500">
          {format(post.date, 'MMMM do, yyyy')}
        </time>
        <h1 className="mt-4 h1 text-gray-900">
          Opportunities for the Week of {format(post.date, 'MMMM do, yyyy')}
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Discover {post.opportunities.length} new opportunities this week across various fields and institutions.
        </p>
      </header>

      <div className="mt-12">
        {post.images.length > 0 && (
          <div className="mb-12">
            {post.images.length >= 4 ? (
              <div className="grid grid-cols-2 gap-4 aspect-[2/1] rounded-lg overflow-hidden">
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
            )}
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {Object.entries(post.groupedOpportunities).map(([type, opportunities]) => (
            <section key={type} className="mb-12">
              <h2 className="h3 text-gray-900 mb-6 capitalize">{type} Opportunities</h2>
              <div className="space-y-8">
                {opportunities.map((opp) => (
                  <div key={opp._id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 flex-shrink-0">
                        <Image
                          src={opp.imageUrl || opp}
                          alt={opp.institution}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="h4 text-gray-900">{opp.institution}</h3>
                        <p className="mt-1 bt1 text-gray-600">{opp.position}</p>
                        <div className="mt-4 flex flex-wrap gap-4">
                          <div className="flex items-center text-gray-500">
                            <span className="bt2">Application Deadline:</span>
                            <time dateTime={opp.applicationDeadline} className="ml-2 bt2">
                              {format(parseISO(opp.applicationDeadline), 'MMMM do, yyyy')}
                            </time>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            href={`/prospecta/${opp._id}`}
                            className="text-primary hover:text-primary/80 bt2"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
