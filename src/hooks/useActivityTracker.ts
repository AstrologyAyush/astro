
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ActivityType = 
  | 'kundali_calculation'
  | 'personality_test'
  | 'daily_horoscope'
  | 'login'
  | 'signup'
  | 'profile_update'
  | 'page_visit'
  | 'feature_usage'
  | 'page_analytics'
  | 'high_value_interaction'
  | 'chart_interaction'
  | 'user_journey'
  | 'conversion_event'
  | 'error_tracking'
  | 'ai_chat_analysis'
  | 'user_preferences';

interface ActivityData {
  [key: string]: any;
}

export const useActivityTracker = () => {
  const trackActivity = useCallback(async (
    activityType: ActivityType,
    activityData?: ActivityData
  ): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Allow anonymous tracking for certain activities
      const anonymousActivities = ['page_analytics', 'error_tracking', 'chart_interaction', 'kundali_calculation', 'feature_usage'];
      
      if (!user && !anonymousActivities.includes(activityType)) {
        console.warn('Cannot track activity: User not authenticated');
        return;
      }

      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user?.id || null,
          activity_type: activityType,
          activity_data: activityData || null,
        });

      if (error) {
        console.error('Error tracking activity:', error);
      } else {
        console.log(`Activity tracked: ${activityType}`);
      }
    } catch (error) {
      console.error('Error in trackActivity:', error);
    }
  }, []);

  const trackPageVisit = useCallback((pageName: string) => {
    trackActivity('page_visit', { page: pageName, timestamp: new Date().toISOString() });
  }, [trackActivity]);

  const trackFeatureUsage = useCallback((featureName: string, additionalData?: ActivityData) => {
    trackActivity('feature_usage', { 
      feature: featureName, 
      timestamp: new Date().toISOString(),
      ...additionalData 
    });
  }, [trackActivity]);

  return {
    trackActivity,
    trackPageVisit,
    trackFeatureUsage,
  };
};
