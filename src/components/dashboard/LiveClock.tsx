import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export const LiveClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50 glass-card p-4 bg-gradient-primary text-primary-foreground shadow-lg"
    >
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5" />
        <div className="text-right">
          <div className="text-lg font-mono font-bold tracking-wide">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm opacity-95 font-medium">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
