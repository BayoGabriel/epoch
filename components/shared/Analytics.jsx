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
        if (!response.ok) throw new Error('Failed to fetch IP');
        const { ip } = await response.json();

        const trackResponse = await fetch('/api/analytics/track', {
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
        
        if (!trackResponse.ok) {
          throw new Error('Failed to track session start');
        }
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    if (mounted) {
      trackSessionStart();
    }
  }, [mounted, sessionId, session?.user?.id, pathname, sessionStartTime]);

  // Track page views
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const response = await fetch('/api/analytics/ip');
        if (!response.ok) throw new Error('Failed to fetch IP');
        const { ip } = await response.json();

        const trackResponse = await fetch('/api/analytics/track', {
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

        if (!trackResponse.ok) {
          throw new Error('Failed to track page view');
        }

        // Store current page as previous page
        window.sessionStorage.setItem('previousPage', pathname);
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    if (mounted) {
      trackPageView();
    }
  }, [mounted, pathname, sessionId, session?.user?.id]);

  // Track session end
  useEffect(() => {
    const trackSessionEnd = async () => {
      try {
        const response = await fetch('/api/analytics/ip');
        if (!response.ok) throw new Error('Failed to fetch IP');
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
            metadata: {
              sessionDuration,
            },
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    // Track session end when component unmounts
    return () => {
      if (mounted) {
        trackSessionEnd();
      }
    };
  }, [mounted, sessionId, session?.user?.id, pathname, sessionStartTime]);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Track opportunity interactions
  useEffect(() => {
    const trackOpportunityInteraction = async (event) => {
      if (!event.target.hasAttribute('data-opportunity-id')) return;

      try {
        const response = await fetch('/api/analytics/ip');
        if (!response.ok) throw new Error('Failed to fetch IP');
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
