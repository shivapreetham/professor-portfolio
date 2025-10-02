'use client';

import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AnalyticsTracker = ({ userId }) => {
  const sessionStartRef = useRef(Date.now());
  const visitorIdRef = useRef(null);
  const hasTrackedView = useRef(false);
  const sessionIdRef = useRef(null);
  const currentSectionRef = useRef(null);
  const sectionStartTimeRef = useRef(null);
  const sectionInteractionsRef = useRef({});

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
    sessionIdRef.current = uuidv4();

    // Get device type
    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/mobile/i.test(ua)) return 'mobile';
      if (/tablet/i.test(ua)) return 'tablet';
      return 'desktop';
    };

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

      // Track section interactions
      if (currentSectionRef.current) {
        if (!sectionInteractionsRef.current[currentSectionRef.current]) {
          sectionInteractionsRef.current[currentSectionRef.current] = 0;
        }
        sectionInteractionsRef.current[currentSectionRef.current]++;
      }
    };

    // Track section time
    const trackSectionTime = async (sectionName, timeSpent, scrollDepth) => {
      try {
        await fetch('/api/analytics/section-time', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            visitorId: visitorIdRef.current,
            sessionId: sessionIdRef.current,
            sectionName,
            timeSpent,
            scrollDepth,
            interactionCount: sectionInteractionsRef.current[sectionName] || 0,
            deviceType: getDeviceType(),
          }),
        });
      } catch (error) {
        console.error('Failed to track section time:', error);
      }
    };

    // Detect which section is in view
    const getSectionInView = () => {
      const sections = document.querySelectorAll('[data-section]');
      let currentSection = null;
      let maxVisibility = 0;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const visibleHeight = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
        const visibility = visibleHeight / viewHeight;

        if (visibility > maxVisibility && visibility > 0.3) {
          maxVisibility = visibility;
          currentSection = section.getAttribute('data-section');
        }
      });

      return currentSection;
    };

    // Get scroll depth for current section
    const getSectionScrollDepth = (sectionName) => {
      const section = document.querySelector(`[data-section="${sectionName}"]`);
      if (!section) return 0;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = rect.height;
      const viewportBottom = window.scrollY + window.innerHeight;

      if (viewportBottom < sectionTop) return 0;
      if (window.scrollY > sectionTop + sectionHeight) return 100;

      const visibleHeight = Math.min(viewportBottom - sectionTop, sectionHeight);
      return Math.round((visibleHeight / sectionHeight) * 100);
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

      // Section-based tracking
      const sectionInView = getSectionInView();

      if (sectionInView && sectionInView !== currentSectionRef.current) {
        // Track time for previous section
        if (currentSectionRef.current && sectionStartTimeRef.current) {
          const timeSpent = Math.round((Date.now() - sectionStartTimeRef.current) / 1000);
          const scrollDepth = getSectionScrollDepth(currentSectionRef.current);

          if (timeSpent > 0) {
            trackSectionTime(currentSectionRef.current, timeSpent, scrollDepth);
          }
        }

        // Start tracking new section
        currentSectionRef.current = sectionInView;
        sectionStartTimeRef.current = Date.now();
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
      // Track final section time before cleanup
      if (currentSectionRef.current && sectionStartTimeRef.current) {
        const timeSpent = Math.round((Date.now() - sectionStartTimeRef.current) / 1000);
        const scrollDepth = getSectionScrollDepth(currentSectionRef.current);
        if (timeSpent > 0) {
          trackSectionTime(currentSectionRef.current, timeSpent, scrollDepth);
        }
      }

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