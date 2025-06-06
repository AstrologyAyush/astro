
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Star, Home, User, Menu } from "lucide-react";
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
    updateSettings({
      language: language === 'hi' ? 'en' : 'hi'
    });
  };

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 w-full">
      {/* Header - Mobile First Design */}
      {isLandingPage && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="container mx-auto px-3 h-14 flex items-center justify-between max-w-7xl">
            <div className="flex items-center gap-2">
              <AppLogo size="sm" />
              <span className="font-bold text-base gradient-heading">AyuAstro</span>
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

      {/* Main Content with proper mobile spacing */}
      <main className={`flex-1 w-full ${!isLoginPage && !isProfilePage ? 'pb-16' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - Enhanced for mobile */}
      {!isLoginPage && !isProfilePage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
          <div className="grid grid-cols-3 gap-1 p-2 max-w-md mx-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                location.pathname === '/' ? 'bg-orange-100 text-orange-600' : ''
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">{getTranslation('Home', 'होम')}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/kundali')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                location.pathname === '/kundali' ? 'bg-orange-100 text-orange-600' : ''
              }`}
            >
              <Star className="h-5 w-5" />
              <span className="text-xs font-medium">{getTranslation('Kundali', 'कुंडली')}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(isLoggedIn ? '/profile' : '/login')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                location.pathname === '/profile' ? 'bg-orange-100 text-orange-600' : ''
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">{getTranslation('Profile', 'प्रोफ़ाइल')}</span>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default AppLayout;
