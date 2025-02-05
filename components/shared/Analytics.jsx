'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [sessionStartTime] = useState(() => new Date());

  // Track session start
  useEffect(() => {
    const trackSessionStart = async () => {
      try {
        const response = await fetch('/api/analytics/ip');
        const { ip } = await response.json();

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'session_start',
            sessionId,
            userId: session?.user?.id,
            path: pathname,
            ip,
            timestamp: sessionStartTime.toISOString(),
          }),
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    if (mounted) {
      trackSessionStart();
    }
  }, [mounted, sessionId, session?.user?.id, pathname, sessionStartTime]);

  // Track page views and session end
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const response = await fetch('/api/analytics/ip');
        const { ip } = await response.json();

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pageview',
            sessionId,
            userId: session?.user?.id,
            path: pathname,
            ip,
            timestamp: new Date().toISOString(),
            metadata: {
              previousPage: window.sessionStorage.getItem('previousPage'),
            },
          }),
        });

        // Store current page as previous page
        window.sessionStorage.setItem('previousPage', pathname);
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    const trackSessionEnd = async () => {
      try {
        const response = await fetch('/api/analytics/ip');
        const { ip } = await response.json();
        const sessionDuration = new Date() - sessionStartTime;

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'session_end',
            sessionId,
            userId: session?.user?.id,
            path: pathname,
            ip,
            timestamp: new Date().toISOString(),
            metadata: {
              sessionDuration,
            },
          }),
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    if (mounted) {
      trackPageView();
      
      // Track session end when component unmounts
      return () => {
        trackSessionEnd();
        setMounted(false);
      };
    }
  }, [pathname, mounted, sessionId, session?.user?.id, sessionStartTime]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track opportunity interactions
  useEffect(() => {
    const trackOpportunityInteraction = async (event) => {
      if (!event.target.hasAttribute('data-opportunity-id')) return;

      try {
        const response = await fetch('/api/analytics/ip');
        const { ip } = await response.json();
        const opportunityId = event.target.getAttribute('data-opportunity-id');
        const interactionType = event.target.getAttribute('data-interaction-type');

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'opportunity_interact',
            sessionId,
            userId: session?.user?.id,
            path: pathname,
            ip,
            timestamp: new Date().toISOString(),
            metadata: {
              opportunityId,
              interactionType,
            },
          }),
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    if (mounted) {
      document.addEventListener('click', trackOpportunityInteraction);
      return () => document.removeEventListener('click', trackOpportunityInteraction);
    }
  }, [mounted, sessionId, session?.user?.id, pathname]);

  return null;
}
