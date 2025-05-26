
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Languages, Star, Home } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
  language: 'hi' | 'en';
  onLanguageToggle: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, language, onLanguageToggle }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isLandingPage = location.pathname === '/landing';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg sm:text-xl gradient-heading">Ayu Explorer</span>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <a href="/landing" className="text-sm hover:text-primary transition-colors">
              {language === 'hi' ? 'होम' : 'Home'}
            </a>
            <a href="/" className="text-sm hover:text-primary transition-colors">
              {language === 'hi' ? 'कुंडली बनाएं' : 'Create Kundali'}
            </a>
            <a href="#features" className="text-sm hover:text-primary transition-colors">
              {language === 'hi' ? 'फीचर्स' : 'Features'}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isLandingPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/landing'}
                className="hidden sm:flex"
              >
                <Home className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'होम' : 'Home'}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={onLanguageToggle} 
              className="min-h-[40px] rounded-full" 
              title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            >
              <Languages className="h-4 w-4 mr-1" />
              {language === 'hi' ? 'EN' : 'हिं'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
          <div className="grid grid-cols-3 gap-1 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/landing'}
              className="flex flex-col gap-1 h-auto py-2"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">{language === 'hi' ? 'होम' : 'Home'}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex flex-col gap-1 h-auto py-2"
            >
              <Star className="h-4 w-4" />
              <span className="text-xs">{language === 'hi' ? 'कुंडली' : 'Kundali'}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLanguageToggle}
              className="flex flex-col gap-1 h-auto py-2"
            >
              <Languages className="h-4 w-4" />
              <span className="text-xs">{language === 'hi' ? 'EN' : 'हिं'}</span>
            </Button>
          </div>
        </nav>
      )}
      
      {/* Padding for mobile navigation */}
      {isMobile && <div className="h-16" />}
    </div>
  );
};

export default AppLayout;
