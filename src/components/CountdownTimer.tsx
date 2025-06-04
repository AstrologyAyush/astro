
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to 7 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
      <CardContent className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Special Launch Offer</span>
          </div>
          <div className="text-xs opacity-90 mb-3">
            Get your detailed Kundali analysis completely FREE!
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white/20 rounded p-2">
              <div className="text-lg font-bold">{timeLeft.days}</div>
              <div className="text-xs">Days</div>
            </div>
            <div className="bg-white/20 rounded p-2">
              <div className="text-lg font-bold">{timeLeft.hours}</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="bg-white/20 rounded p-2">
              <div className="text-lg font-bold">{timeLeft.minutes}</div>
              <div className="text-xs">Min</div>
            </div>
            <div className="bg-white/20 rounded p-2">
              <div className="text-lg font-bold">{timeLeft.seconds}</div>
              <div className="text-xs">Sec</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
