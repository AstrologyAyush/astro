
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';
import { Button } from '@/components/ui/button';
import { Languages, User, LogOut, Home, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background celestial-background">
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3" onClick={() => navigate('/')} role="button">
            <AppLogo size="sm" />
            <h1 className="text-xl font-bold gradient-heading">AyushAstro</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" /> Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/kundali')}>
              <BookOpen className="h-4 w-4 mr-2" /> Kundali
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button variant="ghost" size="icon">
              <Languages className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <Outlet />
        {children}
      </main>
      
      <footer className="py-8 px-4 border-t bg-background/50">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <span className="font-semibold">AyushAstro</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Ancient wisdom meets modern technology
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
