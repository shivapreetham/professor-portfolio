'use client';

import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AnalyticsTracker = ({ userId }) => {
  const sessionStartRef = useRef(Date.now());
  const visitorIdRef = useRef(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!userId) return;

    // Generate or get existing visitor ID
    const getVisitorId = () => {
      let visitorId = localStorage.getItem('portfolio_visitor_id');
      if (!visitorId) {
        visitorId = uuidv4();
        localStorage.setItem('portfolio_visitor_id', visitorId);
      }
      return visitorId;
    };

    visitorIdRef.current = getVisitorId();

    // Track page view
    const trackView = async () => {
      if (hasTrackedView.current) return;
      hasTrackedView.current = true;

      try {
        await fetch('/api/analytics/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            visitorId: visitorIdRef.current,
            referrer: document.referrer || 'direct',
            sessionDuration: 0, // Initial view
          }),
        });
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    // Track interactions
    const trackInteraction = async (interactionType, targetElement, targetId = null, metadata = null) => {
      try {
        await fetch('/api/analytics/track-interaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            visitorId: visitorIdRef.current,
            interactionType,
            targetElement,
            targetId,
            metadata,
          }),
        });
      } catch (error) {
        console.error('Failed to track interaction:', error);
      }
    };

    // Track session end
    const trackSessionEnd = async () => {
      const sessionDuration = Math.round((Date.now() - sessionStartRef.current) / 1000);
      
      try {
        await fetch('/api/analytics/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            visitorId: visitorIdRef.current,
            referrer: document.referrer || 'direct',
            sessionDuration,
          }),
        });
      } catch (error) {
        console.error('Failed to track session end:', error);
      }
    };

    // Set up event listeners for interactions
    const handleClick = (event) => {
      const target = event.target.closest('[data-analytics]');
      if (target) {
        const element = target.getAttribute('data-analytics');
        const id = target.getAttribute('data-analytics-id');
        const metadata = target.getAttribute('data-analytics-meta');
        
        trackInteraction('click', element, id, metadata ? JSON.parse(metadata) : null);
      }
    };

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      // Track major scroll milestones
      if (scrollPercent >= 25 && !sessionStorage.getItem('scroll_25')) {
        sessionStorage.setItem('scroll_25', 'true');
        trackInteraction('scroll', 'page', null, { percent: 25 });
      } else if (scrollPercent >= 50 && !sessionStorage.getItem('scroll_50')) {
        sessionStorage.setItem('scroll_50', 'true');
        trackInteraction('scroll', 'page', null, { percent: 50 });
      } else if (scrollPercent >= 75 && !sessionStorage.getItem('scroll_75')) {
        sessionStorage.setItem('scroll_75', 'true');
        trackInteraction('scroll', 'page', null, { percent: 75 });
      } else if (scrollPercent >= 100 && !sessionStorage.getItem('scroll_100')) {
        sessionStorage.setItem('scroll_100', 'true');
        trackInteraction('scroll', 'page', null, { percent: 100 });
      }
    };

    // Initial view tracking
    trackView();

    // Add event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    // Track when user leaves
    const handleBeforeUnload = () => {
      trackSessionEnd();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackSessionEnd();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Track final session
      trackSessionEnd();
    };
  }, [userId]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;