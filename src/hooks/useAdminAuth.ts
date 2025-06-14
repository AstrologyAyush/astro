
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

        // Check user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          if (mounted) {
            setState({
              user,
              userRole: 'user',
              isAdmin: false,
              isLoading: false,
            });
          }
          return;
        }

        const userRole: UserRole = roleData?.role || 'user';
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
