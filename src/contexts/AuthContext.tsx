
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  profile_image?: string;
}

interface UserWithProfile extends User {
  profile?: Profile;
  savedCharts?: any[];
}

interface AuthContextType {
  user: UserWithProfile | null;
  profile: Profile | null;
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        setProfile(data as Profile);
        return data as Profile;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null;
  };

  // Fetch saved charts for a user
  const fetchSavedCharts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_kundalis')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching saved charts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching saved charts:', error);
    }
    return [];
  };

  useEffect(() => {
    setIsLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        const currentUser = currentSession?.user || null;
        setUser(currentUser as UserWithProfile | null);
        setIsLoggedIn(!!currentUser);

        if (currentUser) {
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentUser.id);
            const savedCharts = await fetchSavedCharts(currentUser.id);
            
            setUser(prev => prev ? {
              ...prev,
              profile: userProfile || undefined,
              savedCharts: savedCharts || []
            } : null);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      const initialUser = initialSession?.user || null;
      setUser(initialUser as UserWithProfile | null);
      setIsLoggedIn(!!initialUser);

      if (initialUser) {
        fetchProfile(initialUser.id).then(userProfile => {
          fetchSavedCharts(initialUser.id).then(savedCharts => {
            setUser(prev => prev ? {
              ...prev,
              profile: userProfile || undefined,
              savedCharts: savedCharts || []
            } : null);
          });
        }).finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Login successful",
        description: "You've been successfully logged in",
      });
      return true;
    } catch (error: any) {
      console.error('Login failed', error);
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      return true;
    } catch (error: any) {
      console.error('Registration failed', error);
      toast({
        title: "Registration error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsLoggedIn(false);
      localStorage.removeItem('ayushAstroUser');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      // Update the local profile state
      const updatedProfile = { ...profile, ...updates } as Profile;
      setProfile(updatedProfile);
      setUser(prev => prev ? { ...prev, profile: updatedProfile } : null);
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoggedIn,
        isLoading,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
