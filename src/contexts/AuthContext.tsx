
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserSettings {
  language: 'hi' | 'en';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  settings: UserSettings;
  savedCharts: any[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoggedIn: boolean;
  settings: UserSettings;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  saveKundali: (name: string, birthData: any, chartData: any) => Promise<boolean>;
  getSavedCharts: () => any[];
}

const defaultSettings: UserSettings = {
  language: 'hi',
  theme: 'dark',
  notifications: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUserProfile(null);
        setSettings(defaultSettings);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      const profile: UserProfile = {
        id: user.id,
        email: user.email!,
        firstName: data?.first_name,
        lastName: data?.last_name,
        settings: data?.settings || defaultSettings,
        savedCharts: data?.saved_charts || [],
      };

      setUserProfile(profile);
      setSettings(profile.settings);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    if (user && userProfile) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ settings: updatedSettings })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating settings:', error);
        } else {
          setUserProfile({ ...userProfile, settings: updatedSettings });
        }
      } catch (error) {
        console.error('Error updating settings:', error);
      }
    }
  };

  const saveKundali = async (name: string, birthData: any, chartData: any): Promise<boolean> => {
    if (!user || !userProfile) return false;

    try {
      const newChart = {
        id: Date.now().toString(),
        name,
        birthData,
        chartData,
        createdAt: new Date().toISOString(),
      };

      const updatedCharts = [...userProfile.savedCharts, newChart];

      const { error } = await supabase
        .from('profiles')
        .update({ saved_charts: updatedCharts })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving kundali:', error);
        return false;
      }

      setUserProfile({ ...userProfile, savedCharts: updatedCharts });
      return true;
    } catch (error) {
      console.error('Error saving kundali:', error);
      return false;
    }
  };

  const getSavedCharts = (): any[] => {
    return userProfile?.savedCharts || [];
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoggedIn: !!user,
    settings,
    login,
    signup,
    logout,
    updateSettings,
    saveKundali,
    getSavedCharts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
