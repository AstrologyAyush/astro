
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Star, Home, User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from './AppLogo';

interface AppLayoutProps {
  children: React.ReactNode;
  language: 'hi' | 'en';
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, language }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, updateSettings } = useAuth();
  
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isProfilePage = location.pathname === '/profile';

  const toggleLanguage = () => {
    updateSettings({ language: language === 'hi' ? 'en' : 'hi' });
  };

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header - only show on landing page */}
      {isLandingPage && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="container mx-auto px-3 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppLogo size="sm" />
              <span className="font-bold text-base gradient-heading">AyushAstro</span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleLanguage} 
                className="h-8 px-2 rounded-full text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {language === 'hi' ? 'EN' : 'हिं'}
              </Button>
              {!isLoggedIn && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className="h-8 px-3 rounded-full text-xs bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {getTranslation('Login', 'लॉगिन')}
                </Button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${!isLoginPage && !isProfilePage ? 'pb-16' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - hide on login and profile pages */}
      {!isLoginPage && !isProfilePage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
          <div className="grid grid-cols-3 gap-1 p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')} 
              className={`flex flex-col gap-0.5 h-12 py-1 rounded-lg text-gray-700 hover:bg-gray-50 ${location.pathname === '/' ? 'bg-orange-100 text-orange-600' : ''}`}
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">{getTranslation('Home', 'होम')}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/kundali')} 
              className={`flex flex-col gap-0.5 h-12 py-1 rounded-lg text-gray-700 hover:bg-gray-50 ${location.pathname === '/kundali' ? 'bg-orange-100 text-orange-600' : ''}`}
            >
              <Star className="h-4 w-4" />
              <span className="text-xs">{getTranslation('Kundali', 'कुंडली')}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(isLoggedIn ? '/profile' : '/login')} 
              className={`flex flex-col gap-0.5 h-12 py-1 rounded-lg text-gray-700 hover:bg-gray-50 ${location.pathname === '/profile' ? 'bg-orange-100 text-orange-600' : ''}`}
            >
              <User className="h-4 w-4" />
              <span className="text-xs">{getTranslation('Profile', 'प्रोफ़ाइल')}</span>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default AppLayout;
