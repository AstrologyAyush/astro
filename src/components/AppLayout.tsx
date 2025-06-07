
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Star, Home, User, Menu, Sun, Moon, Languages, Brain, Calendar } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AppLogo from './AppLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
  language: 'hi' | 'en';
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isProfilePage = location.pathname === '/profile';

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 w-full">
      {/* Enhanced Header - Mobile First Design */}
      {isLandingPage && (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="container mx-auto px-3 h-14 flex items-center justify-between max-w-7xl">
            <div className="flex items-center gap-2">
              <AppLogo size="sm" />
              <span className="font-bold text-base gradient-heading">AyuAstro</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600" />
                )}
              </Button>

              {/* Language Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleLanguage} 
                className="h-8 px-2 rounded-full text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Languages className="h-3 w-3 mr-1" />
                {language === 'hi' ? 'EN' : 'हिं'}
              </Button>

              {/* Menu Dropdown for small screens */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem onClick={() => navigate('/kundali')} className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    {t('kundali')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/personality-test')} className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    {t('personality_test')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/daily-horoscope')} className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('daily_horoscope')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {!isLoggedIn ? (
                    <DropdownMenuItem onClick={() => navigate('/login')} className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {t('login')}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {t('profile')}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/kundali')} 
                  className="h-8 px-3 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('kundali')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/personality-test')} 
                  className="h-8 px-3 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('personality_test')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/daily-horoscope')} 
                  className="h-8 px-3 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('daily_horoscope')}
                </Button>
                {!isLoggedIn && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => navigate('/login')} 
                    className="h-8 px-3 rounded-full text-xs bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {t('login')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content with proper mobile spacing */}
      <main className={`flex-1 w-full ${!isLoginPage && !isProfilePage ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>

      {/* Enhanced Mobile Bottom Navigation */}
      {!isLoginPage && !isProfilePage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-pb transition-colors duration-300 md:hidden">
          <div className="grid grid-cols-5 gap-1 p-2 max-w-md mx-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                location.pathname === '/' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : ''
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">{t('home')}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/kundali')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                location.pathname === '/kundali' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : ''
              }`}
            >
              <Star className="h-5 w-5" />
              <span className="text-xs font-medium">{t('kundali')}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/personality-test')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                location.pathname === '/personality-test' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : ''
              }`}
            >
              <Brain className="h-5 w-5" />
              <span className="text-xs font-medium">{t('test')}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/daily-horoscope')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                location.pathname === '/daily-horoscope' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : ''
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs font-medium">{t('daily')}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(isLoggedIn ? '/profile' : '/login')} 
              className={`flex flex-col gap-1 h-14 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                location.pathname === '/profile' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : ''
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">{t('profile')}</span>
            </Button>
          </div>
        </nav>
      )}

      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      {!isLandingPage && !isLoginPage && !isProfilePage && (
        <nav className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-white dark:md:bg-gray-900 md:border-r md:border-gray-200 dark:md:border-gray-700 md:z-30 md:transition-colors md:duration-300">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <AppLogo size="sm" />
              <span className="font-bold text-lg gradient-heading">AyuAstro</span>
            </div>

            <div className="space-y-2">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                onClick={() => navigate('/')}
                className="w-full justify-start"
              >
                <Home className="h-4 w-4 mr-2" />
                {t('home')}
              </Button>

              <Button
                variant={location.pathname === '/kundali' ? 'default' : 'ghost'}
                onClick={() => navigate('/kundali')}
                className="w-full justify-start"
              >
                <Star className="h-4 w-4 mr-2" />
                {t('kundali')}
              </Button>

              <Button
                variant={location.pathname === '/personality-test' ? 'default' : 'ghost'}
                onClick={() => navigate('/personality-test')}
                className="w-full justify-start"
              >
                <Brain className="h-4 w-4 mr-2" />
                {t('personality_test')}
              </Button>

              <Button
                variant={location.pathname === '/daily-horoscope' ? 'default' : 'ghost'}
                onClick={() => navigate('/daily-horoscope')}
                className="w-full justify-start"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('daily_horoscope')}
              </Button>

              <Button
                variant={location.pathname === '/profile' ? 'default' : 'ghost'}
                onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                {isLoggedIn ? t('profile') : t('login')}
              </Button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="w-full justify-start"
              >
                {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {isDark ? t('light_mode') : t('dark_mode')}
              </Button>

              <Button
                variant="outline"
                onClick={toggleLanguage}
                className="w-full justify-start"
              >
                <Languages className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'English' : 'हिंदी'}
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Main content offset for desktop sidebar */}
      <div className={`${!isLandingPage && !isLoginPage && !isProfilePage ? 'md:ml-64' : ''} transition-all duration-300`}>
        {/* Content is already rendered in main above */}
      </div>
    </div>
  );
};

export default AppLayout;
