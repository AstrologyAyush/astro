
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AppLayout from '@/components/AppLayout';
import LandingPage from '@/components/LandingPage';
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import MobileLogin from '@/components/MobileLogin';
import MobileProfile from '@/components/MobileProfile';
import StandalonePersonalityTest from '@/components/StandalonePersonalityTest';
import DailyHoroscopeWithGuru from '@/components/DailyHoroscopeWithGuru';

function AppContent() {
  const { settings } = useAuth();

  return (
    <Router>
      <AppLayout language={settings.language}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/kundali" element={<Index />} />
          <Route path="/personality-test" element={<StandalonePersonalityTest />} />
          <Route path="/daily-horoscope" element={<DailyHoroscopeWithGuru />} />
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
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
