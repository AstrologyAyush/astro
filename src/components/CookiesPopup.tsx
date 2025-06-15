
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";

const CookiesPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies synchronously
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent) {
      return; // Don't render if already consented
    }

    // Add a small delay to improve initial page load performance
    const delayTimer = setTimeout(() => {
      setShouldRender(true);
      // Add another small delay before showing to allow page to settle
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(showTimer);
    }, 1000);

    return () => clearTimeout(delayTimer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    // Remove from DOM after animation
    setTimeout(() => setShouldRender(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
    // Remove from DOM after animation
    setTimeout(() => setShouldRender(false), 300);
  };

  // Don't render anything if not needed
  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${
        isVisible 
          ? 'bg-black/50 backdrop-blur-sm opacity-100' 
          : 'bg-transparent opacity-0 pointer-events-none'
      }`}
    >
      <Card className={`max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                We use cookies
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience and analyze our traffic. 
                By clicking "Accept", you consent to our use of cookies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button 
                  onClick={handleAccept}
                  className="bg-orange-500 hover:bg-orange-600 text-white min-h-[44px] text-sm sm:text-base"
                  size="sm"
                >
                  Accept All
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  className="border-gray-300 dark:border-gray-600 min-h-[44px] text-sm sm:text-base"
                  size="sm"
                >
                  Decline
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="flex-shrink-0 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mt-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiesPopup;
