
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
  created_at: string;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi';
  notifications: boolean;
}

interface SavedKundali {
  id: string;
  name: string;
  birth_data: any;
  chart_data: any;
  created_at: string;
}

interface UserWithProfile extends User {
  profile?: Profile;
  settings?: UserSettings;
  savedKundalis?: SavedKundali[];
}

interface AuthContextType {
  user: UserWithProfile | null;
  profile: Profile | null;
  settings: UserSettings;
  savedKundalis: SavedKundali[];
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  saveKundali: (name: string, birthData: any, chartData: any) => Promise<boolean>;
  deleteKundali: (id: string) => Promise<boolean>;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  language: 'en',
  notifications: true
};

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
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [savedKundalis, setSavedKundalis] = useState<SavedKundali[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('ayush-astro-settings');
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        const currentUser = currentSession?.user || null;
        setUser(currentUser as UserWithProfile | null);
        setIsLoggedIn(!!currentUser);

        if (currentUser) {
          // Simulate profile and kundali loading (since no tables exist)
          setTimeout(() => {
            const mockProfile: Profile = {
              id: currentUser.id,
              first_name: currentUser.user_metadata?.first_name || 'User',
              last_name: currentUser.user_metadata?.last_name || '',
              birth_date: currentUser.user_metadata?.birth_date,
              profile_image: currentUser.user_metadata?.profile_image,
              created_at: currentUser.created_at
            };
            
            setProfile(mockProfile);
            setUser(prev => prev ? { ...prev, profile: mockProfile } : null);
            
            // Load saved kundalis from localStorage for now
            const savedKundalisKey = `saved-kundalis-${currentUser.id}`;
            const userKundalis = localStorage.getItem(savedKundalisKey);
            if (userKundalis) {
              setSavedKundalis(JSON.parse(userKundalis));
            }
          }, 0);
        } else {
          setProfile(null);
          setSavedKundalis([]);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      const initialUser = initialSession?.user || null;
      setUser(initialUser as UserWithProfile | null);
      setIsLoggedIn(!!initialUser);

      if (!initialUser) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
        title: "Welcome back!",
        description: "You've been successfully logged in",
      });
      return true;
    } catch (error: any) {
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
      const { error } = await supabase.auth.signUp({
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
        title: "Account created!",
        description: "Please check your email to verify your account",
      });
      return true;
    } catch (error: any) {
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
      setSavedKundalis([]);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedProfile = { ...profile, ...updates } as Profile;
      setProfile(updatedProfile);
      setUser(prev => prev ? { ...prev, profile: updatedProfile } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      return true;
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>): Promise<void> => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('ayush-astro-settings', JSON.stringify(newSettings));
    
    // Apply theme immediately
    if (updates.theme) {
      const root = document.documentElement;
      if (updates.theme === 'dark') {
        root.classList.add('dark');
      } else if (updates.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System theme
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  };

  const saveKundali = async (name: string, birthData: any, chartData: any): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newKundali: SavedKundali = {
        id: Date.now().toString(),
        name,
        birth_data: birthData,
        chart_data: chartData,
        created_at: new Date().toISOString()
      };
      
      const updatedKundalis = [...savedKundalis, newKundali];
      setSavedKundalis(updatedKundalis);
      
      // Save to localStorage for now
      const savedKundalisKey = `saved-kundalis-${user.id}`;
      localStorage.setItem(savedKundalisKey, JSON.stringify(updatedKundalis));
      
      toast({
        title: "Kundali saved",
        description: `${name} has been saved to your collection`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your kundali",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteKundali = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedKundalis = savedKundalis.filter(k => k.id !== id);
      setSavedKundalis(updatedKundalis);
      
      const savedKundalisKey = `saved-kundalis-${user.id}`;
      localStorage.setItem(savedKundalisKey, JSON.stringify(updatedKundalis));
      
      toast({
        title: "Kundali deleted",
        description: "The kundali has been removed from your collection",
      });
      return true;
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the kundali",
        variant: "destructive"
      });
      return false;
    }
  };

  // Apply initial theme
  useEffect(() => {
    updateSettings({ theme: settings.theme });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        settings,
        savedKundalis,
        session,
        isLoggedIn,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        updateSettings,
        saveKundali,
        deleteKundali
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
