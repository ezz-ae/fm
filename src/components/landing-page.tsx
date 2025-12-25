"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Waves, Zap, Target, Shield, ArrowRight } from 'lucide-react';

const homeAspirations = [
  { icon: Target, title: "Resolve a binary conflict", desc: "Forced clarity through motion." },
  { icon: Zap, title: "Master the staccato flux", desc: "Sync with high-frequency learning." },
  { icon: Shield, title: "Manifest Absolute Confidence", desc: "Stabilize your neural archetype." },
  { icon: Waves, title: "Join the Collective Wave", desc: "Synchronize with 1.4k active nodes." }
];

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-transition on any mouse move OR touch
    const handleMove = () => {
       onStart();
    };
    window.addEventListener('mousemove', handleMove, { once: true });
    window.addEventListener('touchstart', handleMove, { once: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleMove);
    };
  }, [onStart]);

  return (
    <div className={cn(
      "fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 md:p-8 transition-opacity duration-[2000ms] ease-in-out overflow-hidden touch-none",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
       {/* Drifting Background Aspirations */}
       <div className="absolute inset-0 opacity-20 pointer-events-none">
          {homeAspirations.map((a, i) => (
            <div
              key={i}
              className="absolute text-primary/5 text-[10px] md:text-sm font-light tracking-[1em] uppercase whitespace-nowrap"
              style={{
                left: `${(i * 20 + 10) % 80}%`,
                top: `${(i * 15 + 20) % 70}%`,
                animation: `drift ${40 + i * 10}s infinite linear`,
              }}
            >
              {a.title}
            </div>
          ))}
       </div>

       <div className="max-w-4xl w-full space-y-16 md:space-y-24 text-center z-10">
          <header className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black text-primary tracking-tighter lowercase">unwritten</h1>
            <p className="text-primary/40 text-[10px] md:text-xs tracking-[1em] uppercase">The Motion Frequency Adaptor</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {homeAspirations.map((a, i) => (
              <div key={i} className="p-6 md:p-10 border border-primary/5 bg-primary/[0.01] space-y-4 text-left group active:scale-95 transition-transform duration-200">
                <a.icon size={20} className="text-primary/20 group-hover:text-primary transition-colors duration-500" />
                <h3 className="text-primary font-light text-lg md:text-xl tracking-tight">{a.title}</h3>
                <p className="text-primary/30 text-[10px] md:text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-12 animate-pulse">
            <p className="text-primary/20 text-[8px] md:text-[10px] tracking-[1.5em] uppercase">Move to calibrate frequency</p>
          </div>
       </div>

       <style jsx>{`
         @keyframes drift {
           from { transform: translateX(-20%); }
           to { transform: translateX(20%); }
         }
       `}</style>
    </div>
  );
};

export default LandingPage;
