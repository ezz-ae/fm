"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from './ui/slider';

const ValuationGame = ({ onComplete }: { onComplete: (value: number) => void }) => {
  const [value, setValue] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAccept = () => {
    setIsAccepted(true);
    setTimeout(() => onComplete(value), 1200);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-in-out touch-none",
      isVisible ? "opacity-100" : "opacity-0",
      isAccepted && "blur-[100px] scale-[2] opacity-0"
    )}>
      {/* Dynamic Background Aura */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / ${value / 100}) 0%, transparent 70%)`,
          opacity: isHovered ? 0.3 : 0.1
        }}
      />

      <div className="relative group flex flex-col items-center justify-center flex-1 w-full">
        {/* The resizing $ sign */}
        <div 
          className="text-primary font-extralight mb-16 md:mb-32 transition-all duration-500 ease-out select-none cursor-default"
          style={{ 
            fontSize: `${3 + (value * 1.5)}rem`, // Slightly smaller scaling for mobile
            opacity: 0.05 + (value / 11),
            filter: `blur(${(10 - value) * 1.2}px) drop-shadow(0 0 ${value * 4}px hsl(var(--primary) / 0.3))`,
            transform: `rotate(${Math.sin(value) * 5}deg)`
          }}
        >
          $
        </div>

        {/* Floating Valuations */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-primary/10 font-mono text-6xl md:text-8xl transition-all duration-[2000ms] ease-out"
              style={{
                left: `${50 + (Math.cos(i + value/2) * 30)}%`, // Reduced radius for mobile
                top: `${50 + (Math.sin(i + value/2) * 30)}%`,
                transform: `scale(${0.2 + (value / 5)}) translate(-50%, -50%)`,
                opacity: (value > i) ? 0.15 : 0,
                filter: `blur(${12 - value}px)`
              }}
            >
              {Math.floor(Math.pow(value, i + 1))}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm space-y-12 md:space-y-16 text-center z-10 px-8 pb-16 md:pb-0">
        <div className="space-y-4">
          <Slider
            value={[value]}
            onValueChange={(v) => setValue(v[0])}
            min={1}
            max={10}
            step={1}
            className="cursor-pointer py-4 touch-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          />
          <div className="flex justify-between text-[10px] tracking-[0.5em] text-primary/20 uppercase">
             <span>Breath</span>
             <span>Weight</span>
          </div>
        </div>
        
        <button
          onClick={handleAccept}
          className="group relative px-8 py-4 md:py-2 overflow-hidden touch-manipulation"
        >
          <span className="relative z-10 text-primary/30 group-hover:text-primary transition-colors text-xs tracking-[0.6em] uppercase">
            Commit to Truth
          </span>
          <div className="absolute inset-x-0 bottom-0 h-px bg-primary/0 group-hover:bg-primary/40 transition-all duration-1000 transform scale-x-0 group-hover:scale-x-100" />
        </button>
      </div>
    </div>
  );
};

export default ValuationGame;
