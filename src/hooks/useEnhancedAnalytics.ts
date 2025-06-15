
import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useActivityTracker } from './useActivityTracker';

export interface PageAnalytics {
  page: string;
  timeSpent: number;
  scrollDepth: number;
  clickCount: number;
  sessionId: string;
}

export interface UserPreferences {
  language: 'hi' | 'en';
  preferredChartTypes: string[];
  favoriteFeatures: string[];
  lastActiveFeatures: string[];
}

export interface InteractionEvent {
  elementId?: string;
  elementType: string;
  action: 'click' | 'hover' | 'scroll' | 'focus';
  coordinates?: { x: number; y: number };
  timestamp: string;
  context?: any;
}

export const useEnhancedAnalytics = () => {
  const { trackActivity } = useActivityTracker();
  const pageStartTime = useRef<number>(Date.now());
  const sessionId = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const maxScrollDepth = useRef<number>(0);
  const clickCount = useRef<number>(0);
  const interactions = useRef<InteractionEvent[]>([]);

  // Track page analytics
  const trackPageAnalytics = useCallback(async (pageName: string) => {
    const timeSpent = Date.now() - pageStartTime.current;
    const scrollDepth = maxScrollDepth.current;
    
    const analytics: PageAnalytics = {
      page: pageName,
      timeSpent,
      scrollDepth,
      clickCount: clickCount.current,
      sessionId: sessionId.current
    };

    await trackActivity('page_analytics', {
      ...analytics,
      interactions: interactions.current
    });

    // Reset counters for next page
    pageStartTime.current = Date.now();
    maxScrollDepth.current = 0;
    clickCount.current = 0;
    interactions.current = [];
  }, [trackActivity]);

  // Track detailed interactions
  const trackInteraction = useCallback(async (event: InteractionEvent) => {
    interactions.current.push(event);
    
    if (event.action === 'click') {
      clickCount.current++;
    }

    // Track specific high-value interactions immediately
    if (event.elementType === 'chart' || event.elementType === 'ai-chat' || event.elementType === 'prediction') {
      await trackActivity('high_value_interaction', {
        ...event,
        sessionId: sessionId.current
      });
    }
  }, [trackActivity]);

  // Track chart interactions specifically
  const trackChartInteraction = useCallback(async (chartType: string, action: string, data?: any) => {
    await trackActivity('chart_interaction', {
      chartType,
      action,
      data,
      sessionId: sessionId.current,
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  // Track AI chat patterns
  const trackAIChat = useCallback(async (query: string, response: string, satisfaction?: number) => {
    await trackActivity('ai_chat_analysis', {
      queryLength: query.length,
      responseLength: response.length,
      queryType: categorizeQuery(query),
      satisfaction,
      sessionId: sessionId.current,
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  // Track user preferences
  const trackUserPreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    await trackActivity('user_preferences', {
      ...preferences,
      sessionId: sessionId.current,
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  // Track conversion events
  const trackConversion = useCallback(async (conversionType: string, value?: number, metadata?: any) => {
    await trackActivity('conversion_event', {
      conversionType,
      value,
      metadata,
      sessionId: sessionId.current,
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  // Track errors
  const trackError = useCallback(async (error: Error, context: string, userAction?: string) => {
    await trackActivity('error_tracking', {
      errorMessage: error.message,
      errorStack: error.stack,
      context,
      userAction,
      sessionId: sessionId.current,
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  // Track user journey step
  const trackJourneyStep = useCallback(async (step: string, stepData?: any) => {
    await trackActivity('user_journey', {
      step,
      stepData,
      sessionId: sessionId.current,
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      
      if (scrollPercentage > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercentage;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, track the session
        trackPageAnalytics(window.location.pathname);
      } else {
        // Page is visible again, reset timer
        pageStartTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackPageAnalytics]);

  return {
    trackPageAnalytics,
    trackInteraction,
    trackChartInteraction,
    trackAIChat,
    trackUserPreferences,
    trackConversion,
    trackError,
    trackJourneyStep,
    sessionId: sessionId.current
  };
};

// Helper function to categorize AI queries
function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('marriage') || lowerQuery.includes('love') || lowerQuery.includes('relationship')) {
    return 'relationship';
  } else if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('profession')) {
    return 'career';
  } else if (lowerQuery.includes('health') || lowerQuery.includes('disease')) {
    return 'health';
  } else if (lowerQuery.includes('money') || lowerQuery.includes('finance') || lowerQuery.includes('wealth')) {
    return 'finance';
  } else if (lowerQuery.includes('dasha') || lowerQuery.includes('period')) {
    return 'dasha';
  } else if (lowerQuery.includes('yoga') || lowerQuery.includes('combination')) {
    return 'yoga';
  } else if (lowerQuery.includes('remedy') || lowerQuery.includes('solution')) {
    return 'remedy';
  } else {
    return 'general';
  }
}
