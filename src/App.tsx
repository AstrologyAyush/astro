
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import LandingPage from '@/components/LandingPage';
import Index from '@/pages/Index';
import MobileLogin from '@/components/MobileLogin';
import MobileProfile from '@/components/MobileProfile';

function AppContent() {
  const { settings } = useAuth();

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
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
  }, [settings.theme]);

  return (
    <Router>
      <AppLayout language={settings.language}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/kundali" element={<Index />} />
          <Route path="/login" element={<MobileLogin />} />
          <Route path="/profile" element={<MobileProfile />} />
        </Routes>
      </AppLayout>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
