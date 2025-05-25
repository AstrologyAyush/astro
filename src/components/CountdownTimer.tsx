
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 43,
    seconds: 21
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className={`inline-block bg-card border rounded-lg p-3 sm:p-4 ${className}`}>
      <p className="text-xs sm:text-sm font-medium mb-2 text-center">OFFER EXPIRES IN:</p>
      <div className="flex gap-2 sm:gap-4 text-xl sm:text-2xl font-bold justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 sm:w-16 p-2 bg-muted/50 rounded text-center">
            {formatTime(timeLeft.hours)}
          </div>
          <span className="text-xs mt-1">HRS</span>
        </div>
        <div className="flex items-center">:</div>
        <div className="flex flex-col items-center">
          <div className="w-12 sm:w-16 p-2 bg-muted/50 rounded text-center">
            {formatTime(timeLeft.minutes)}
          </div>
          <span className="text-xs mt-1">MIN</span>
        </div>
        <div className="flex items-center">:</div>
        <div className="flex flex-col items-center">
          <div className="w-12 sm:w-16 p-2 bg-muted/50 rounded text-center">
            {formatTime(timeLeft.seconds)}
          </div>
          <span className="text-xs mt-1">SEC</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
