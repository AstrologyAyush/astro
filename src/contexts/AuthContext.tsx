
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
  birthDate?: string;
  profileImage?: string;
  settings: UserSettings;
  savedCharts: any[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  profile: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  settings: UserSettings;
  savedKundalis: any[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  updateProfile: (profileData: any) => Promise<boolean>;
  saveKundali: (name: string, birthData: any, chartData: any) => Promise<boolean>;
  getSavedCharts: () => any[];
  deleteKundali: (id: string) => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
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
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      setIsLoading(true);
      
      // For now, create a profile from user metadata since we don't have database tables
      const profile: UserProfile = {
        id: user.id,
        email: user.email!,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        birthDate: '',
        profileImage: '',
        settings: defaultSettings,
        savedCharts: [],
      };

      setUserProfile(profile);
      setSettings(profile.settings);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
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
      // Update the profile with new settings
      setUserProfile({ ...userProfile, settings: updatedSettings });
    }
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    if (!user || !userProfile) return false;

    try {
      // Update local state since we don't have database tables yet
      const updatedProfile = { ...userProfile, ...profileData };
      setUserProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
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
      setUserProfile({ ...userProfile, savedCharts: updatedCharts });
      return true;
    } catch (error) {
      console.error('Error saving kundali:', error);
      return false;
    }
  };

  const deleteKundali = async (id: string): Promise<boolean> => {
    if (!user || !userProfile) return false;

    try {
      const updatedCharts = userProfile.savedCharts.filter(chart => chart.id !== id);
      setUserProfile({ ...userProfile, savedCharts: updatedCharts });
      return true;
    } catch (error) {
      console.error('Error deleting kundali:', error);
      return false;
    }
  };

  const getSavedCharts = (): any[] => {
    return userProfile?.savedCharts || [];
  };

  const value: AuthContextType = {
    user,
    userProfile,
    profile: userProfile,
    isLoggedIn: !!user,
    isLoading,
    settings,
    savedKundalis: userProfile?.savedCharts || [],
    login,
    signup,
    logout,
    updateSettings,
    updateProfile,
    saveKundali,
    getSavedCharts,
    deleteKundali,
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
