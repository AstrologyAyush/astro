import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Languages, Star, Home, Menu } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import AppLogo from './AppLogo';
interface AppLayoutProps {
  children: React.ReactNode;
  language: 'hi' | 'en';
  onLanguageToggle: () => void;
}
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  language,
  onLanguageToggle
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isLandingPage = location.pathname === '/';
  return <div className="min-h-screen bg-background">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-3 h-14 flex items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <div className="flex items-center gap-2">
            <AppLogo size="sm" />
            <span className="font-bold text-base gradient-heading">Ayu Explorer</span>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onLanguageToggle} className="h-8 px-2 rounded-full text-xs">
              <Languages className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'EN' : 'हिं'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 safe-area-pb">
        <div className="grid grid-cols-3 gap-1 p-1">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="flex flex-col gap-0.5 h-12 py-1 rounded-lg">
            <Home className="h-4 w-4" />
            <span className="text-xs">{language === 'hi' ? 'होम' : 'Home'}</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/kundali'} className="flex flex-col gap-0.5 h-12 py-1 rounded-lg bg-slate-950 hover:bg-slate-800">
            <Star className="h-4 w-4" />
            <span className="text-xs">{language === 'hi' ? 'कुंडली' : 'Kundali'}</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onLanguageToggle} className="flex flex-col gap-0.5 h-12 py-1 rounded-lg">
            <Languages className="h-4 w-4" />
            <span className="text-xs">{language === 'hi' ? 'भाषा' : 'Lang'}</span>
          </Button>
        </div>
      </nav>
    </div>;
};
export default AppLayout;