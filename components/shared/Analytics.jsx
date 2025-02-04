'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const trackPageView = async () => {
      try {
        // Get IP address from our own API endpoint to avoid CORS issues
        const response = await fetch('/api/analytics/ip');
        const { ip } = await response.json();

        // Track the page view
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'pageview',
            path: pathname,
            ip,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    if (mounted) {
      trackPageView();
    }

    return () => {
      setMounted(false);
    };
  }, [pathname, mounted]);

  // Don't render anything visible
  return null;
}
