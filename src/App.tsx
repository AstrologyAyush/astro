
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import AppLayout from '@/components/AppLayout';
import LandingPage from '@/components/LandingPage';
import Index from '@/pages/Index';

function App() {
  const [language, setLanguage] = useState<'hi' | 'en'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  return (
    <Router>
      <AppLayout language={language} onLanguageToggle={toggleLanguage}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/kundali" element={<Index />} />
        </Routes>
      </AppLayout>
      <Toaster />
    </Router>
  );
}

export default App;
