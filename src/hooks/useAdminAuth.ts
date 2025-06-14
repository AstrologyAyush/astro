
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'owner' | 'staff' | 'user';

interface AdminAuthState {
  user: User | null;
  userRole: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
}

// For now, we'll use a simple email-based admin check
// In production, you should use proper role management
const ADMIN_EMAILS = [
  'admin@yourdomain.com', // Replace with actual admin email
  'owner@yourdomain.com'  // Replace with actual owner email
];

const STAFF_EMAILS = [
  'staff@yourdomain.com'  // Replace with actual staff emails
];

export const useAdminAuth = (): AdminAuthState => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    userRole: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const checkAdminAuth = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          if (mounted) {
            setState({
              user: null,
              userRole: null,
              isAdmin: false,
              isLoading: false,
            });
          }
          return;
        }

        // Check user role based on email
        // TODO: Replace this with proper role checking once user_roles table is working
        let userRole: UserRole = 'user';
        
        if (user.email && ADMIN_EMAILS.includes(user.email)) {
          userRole = 'owner';
        } else if (user.email && STAFF_EMAILS.includes(user.email)) {
          userRole = 'staff';
        }

        const isAdmin = userRole === 'owner' || userRole === 'staff';

        if (mounted) {
          setState({
            user,
            userRole,
            isAdmin,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error in checkAdminAuth:', error);
        if (mounted) {
          setState({
            user: null,
            userRole: null,
            isAdmin: false,
            isLoading: false,
          });
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          checkAdminAuth();
        }
      }
    );

    // Initial check
    checkAdminAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
