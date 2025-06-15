
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'premium';

interface SubscriptionState {
  user: User | null;
  subscribed: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionEnd: string | null;
  trialEnd: string | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  createCheckout: (tier: SubscriptionTier) => Promise<void>;
  manageSubscription: () => Promise<void>;
}

export const useSubscription = (): SubscriptionState => {
  const [state, setState] = useState<{
    user: User | null;
    subscribed: boolean;
    subscriptionTier: SubscriptionTier;
    subscriptionEnd: string | null;
    trialEnd: string | null;
    isLoading: boolean;
  }>({
    user: null,
    subscribed: false,
    subscriptionTier: 'free',
    subscriptionEnd: null,
    trialEnd: null,
    isLoading: true,
  });

  const { toast } = useToast();

  const refreshSubscription = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Error",
          description: "Failed to check subscription status",
          variant: "destructive"
        });
        return;
      }

      setState(prev => ({
        ...prev,
        subscribed: data.subscribed || false,
        subscriptionTier: data.subscription_tier || 'free',
        subscriptionEnd: data.subscription_end || null,
        isLoading: false,
      }));

    } catch (error) {
      console.error('Error in refreshSubscription:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const createCheckout = async (tier: SubscriptionTier) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier }
      });
      
      if (error || !data.url) {
        throw new Error(error?.message || 'Failed to create checkout session');
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to checkout",
        description: "Please complete your payment in the new tab",
      });

    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const manageSubscription = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error || !data.url) {
        throw new Error(error?.message || 'Failed to create customer portal session');
      }

      // Open Stripe customer portal in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to customer portal",
        description: "Manage your subscription in the new tab",
      });

    } catch (error) {
      console.error('Error accessing customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to access customer portal",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (mounted) {
        setState(prev => ({ ...prev, user }));
        if (user) {
          refreshSubscription();
        } else {
          setState(prev => ({ 
            ...prev, 
            subscribed: false, 
            subscriptionTier: 'free', 
            subscriptionEnd: null,
            isLoading: false 
          }));
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          checkAuth();
        }
      }
    );

    // Initial check
    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...state,
    refreshSubscription,
    createCheckout,
    manageSubscription,
  };
};
