'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO, startOfWeek, endOfWeek } from 'date-fns';

export default function BlogPost({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { weekId } = params;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch('/api/opportunities/main?status=approved');
        const opportunities = await response.json();

        // Get week start and end dates
        const weekStart = startOfWeek(parseISO(weekId));
        const weekEnd = endOfWeek(weekStart);
        
        // Filter opportunities for this week
        const weekOpportunities = opportunities.filter(opp => {
          const oppDate = parseISO(opp.dateCreated);
          return oppDate >= weekStart && oppDate <= weekEnd;
        });

        // Group opportunities by type
        const groupedOpportunities = weekOpportunities.reduce((acc, opp) => {
          if (!acc[opp.type]) {
            acc[opp.type] = [];
          }
          acc[opp.type].push(opp);
          return acc;
        }, {});

        const types = Object.keys(groupedOpportunities);
        
        setPost({
          weekStart,
          weekEnd,
          opportunities: weekOpportunities,
          groupedOpportunities,
          types,
          count: weekOpportunities.length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    if (weekId) {
      fetchPost();
    }
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
            ← Back to all weeks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="text-primary hover:text-primary/80">
        ← Back to all weeks
      </Link>

      <header className="mt-8 text-center">
        <time dateTime={format(post.weekStart, 'yyyy-MM-dd')} className="text-gray-500">
          Week of {format(post.weekStart, 'MMMM d')} - {format(post.weekEnd, 'MMMM d, yyyy')}
        </time>
        <h1 className="mt-4 h1 text-gray-900">
          {post.types.join(', ')} Opportunities
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          {post.count} opportunities available this week
        </p>
      </header>

      <div className="mt-16 space-y-16">
        {Object.entries(post.groupedOpportunities).map(([type, opportunities]) => (
          <section key={type} className="mb-12">
            <h2 className="h3 text-gray-900 mb-6 capitalize">{type} Opportunities</h2>
            <div className="space-y-8">
              {opportunities.map((opp) => (
                <div key={opp._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 flex-shrink-0 relative">
                      <Image
                        src={opp.imageUrl || '/opp.svg'}
                        alt={opp.title || 'Opportunity'}
                        fill
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
    </article>
  );
}
