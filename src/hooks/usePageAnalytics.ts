
import { useEffect, useRef } from 'react';
import { useEnhancedAnalytics } from './useEnhancedAnalytics';

export const usePageAnalytics = (pageName: string) => {
  const { trackPageAnalytics, trackInteraction, trackJourneyStep } = useEnhancedAnalytics();
  const hasTrackedEntry = useRef(false);

  useEffect(() => {
    // Track page entry
    if (!hasTrackedEntry.current) {
      trackJourneyStep('page_entry', { page: pageName });
      hasTrackedEntry.current = true;
    }

    // Track page exit on cleanup
    return () => {
      trackPageAnalytics(pageName);
      trackJourneyStep('page_exit', { page: pageName });
    };
  }, [pageName, trackPageAnalytics, trackJourneyStep]);

  // Return tracking functions for manual use
  return {
    trackInteraction,
    trackJourneyStep
  };
};
