
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Sparkles } from "lucide-react";
import RishiParasherGuru from './RishiParasherGuru';

interface FloatingChatbotProps {
  kundaliData: any;
  numerologyData: any;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ kundaliData, numerologyData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'hi' || savedLanguage === 'en') {
      setLanguage(savedLanguage);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button when closed - smaller and more mobile-friendly */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full p-3 shadow-lg min-h-[56px] max-w-[200px] sm:max-w-none"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
              alt="Rishi Parasher" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">
            {language === 'hi' ? 'ऋषि पराशर से परामर्श' : 'Consult Rishi Parasher'}
          </span>
          <span className="text-xs font-medium sm:hidden">
            {language === 'hi' ? 'परामर्श' : 'Chat'}
          </span>
        </Button>
      )}

      {/* Chat interface when open - responsive sizing */}
      {isOpen && (
        <Card className="w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] shadow-xl border-orange-200 overflow-hidden max-h-[80vh] sm:max-h-[70vh]">
          {/* Chat header - more compact on mobile */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img 
                  src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                  alt="Rishi Parasher" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-xs sm:text-sm truncate">
                {language === 'hi' ? 'ऋषि पराशर' : 'Rishi Parasher'}
              </span>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Language toggle - more compact */}
              <div className="bg-white/20 rounded-md p-1">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded-sm text-xs ${language === 'en' ? 'bg-white text-orange-600' : 'text-white'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('hi')}
                  className={`px-1.5 py-0.5 rounded-sm text-xs ${language === 'hi' ? 'bg-white text-orange-600' : 'text-white'}`}
                >
                  हि
                </button>
              </div>
              
              {/* Close button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-white hover:bg-white/20" 
                onClick={toggleChat}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Chat content */}
          <div className="overflow-y-auto p-0 bg-gradient-to-br from-orange-50 to-red-50">
            <RishiParasherGuru kundaliData={kundaliData} language={language} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default FloatingChatbot;
