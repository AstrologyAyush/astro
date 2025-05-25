
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';
import { Button } from '@/components/ui/button';
import { 
  Languages, 
  User, 
  LogOut, 
  Home, 
  BookOpen, 
  Menu, 
  X, 
  ChevronDown,
  UserCircle,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = () => {
    if (user?.profile?.first_name && user?.profile?.last_name) {
      return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-background celestial-background">
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3" onClick={() => navigate('/')} role="button">
            <AppLogo size="md" />
            <h1 className="text-lg sm:text-xl font-bold gradient-heading">Ayu</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="min-h-[40px]">
              <Home className="h-4 w-4 mr-2" /> Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/kundali')} className="min-h-[40px]">
              <BookOpen className="h-4 w-4 mr-2" /> Kundali
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="min-h-[40px] text-xs sm:text-sm">
                <User className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Login</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden md:flex min-h-[40px]">
                      <Avatar className="h-5 w-5 sm:h-6 sm:w-6 mr-2">
                        <AvatarImage src={user.profile?.profile_image || undefined} />
                        <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs sm:text-sm truncate max-w-24">
                        {user.profile?.first_name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden min-h-[40px] min-w-[40px]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] max-w-[350px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center gap-3 mb-8">
                    <AppLogo size="md" />
                    <h2 className="text-xl font-bold gradient-heading">Ayu</h2>
                  </div>
                  
                  {isLoggedIn && (
                    <div className="flex items-center space-x-3 mb-6 p-3 sm:p-4 bg-primary/10 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profile?.profile_image || undefined} />
                        <AvatarFallback className="text-sm">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.profile?.first_name 
                            ? `${user.profile.first_name} ${user.profile.last_name || ''}` 
                            : user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <nav className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start min-h-[44px]" 
                      onClick={() => { 
                        navigate('/');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Home className="mr-3 h-5 w-5" />
                      Home
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start min-h-[44px]" 
                      onClick={() => { 
                        navigate('/kundali');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <BookOpen className="mr-3 h-5 w-5" />
                      Kundali
                    </Button>
                    
                    {isLoggedIn ? (
                      <>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start min-h-[44px]" 
                          onClick={() => { 
                            navigate('/dashboard');
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LayoutDashboard className="mr-3 h-5 w-5" />
                          Dashboard
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start min-h-[44px]" 
                          onClick={() => { 
                            navigate('/profile');
                            setMobileMenuOpen(false);
                          }}
                        >
                          <UserCircle className="mr-3 h-5 w-5" />
                          Profile
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive min-h-[44px]" 
                          onClick={() => { 
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full min-h-[44px]" 
                        onClick={() => { 
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-3 h-5 w-5" />
                        Login / Register
                      </Button>
                    )}
                  </nav>
                  
                  <div className="mt-auto">
                    <Button variant="ghost" className="w-full justify-start min-h-[44px]">
                      <Languages className="mr-3 h-5 w-5" />
                      Change Language
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-4 sm:py-6 px-3 sm:px-4">
        <Outlet />
        {children}
      </main>
      
      <footer className="py-6 sm:py-8 px-3 sm:px-4 border-t bg-background/50">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <span className="font-semibold text-sm sm:text-base">Ayu</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              Ancient wisdom meets modern technology
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
