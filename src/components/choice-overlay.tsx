"use client";

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ChoiceOverlayProps {
  onChoice: (choice: 'yes' | 'no') => void;
  onHover: (choice: 'yes' | 'no' | null) => void;
}

const ChoiceOverlay = ({ onChoice, onHover }: ChoiceOverlayProps) => {
  const [dollarState, setDollarState] = useState<'hidden' | 'entering' | 'fading'>('hidden');
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const dollarEnterTimer = setTimeout(() => setDollarState('entering'), 400);
    const buttonsTimer = setTimeout(() => setShowButtons(true), 1200);
    const dollarFadeTimer = setTimeout(() => setDollarState('fading'), 3500);

    return () => {
      clearTimeout(dollarEnterTimer);
      clearTimeout(buttonsTimer);
      clearTimeout(dollarFadeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center gap-16 bg-transparent">
      {/* Ghostly Dollar Sign - Symbols are more powerful than text */}
      <div 
        className={cn(
          "absolute left-[12%] top-1/2 -translate-y-1/2 text-[15rem] font-black text-primary/[0.03] pointer-events-none transition-all duration-[3000ms] ease-in-out -skew-x-12",
          dollarState === 'hidden' && "opacity-0 scale-50 blur-3xl translate-x-[-100px]",
          dollarState === 'entering' && "opacity-100 scale-100 blur-none translate-x-0",
          dollarState === 'fading' && "opacity-0 scale-[1.2] blur-[100px] translate-x-[100px]"
        )}
      >
        $
      </div>

      <div className={cn(
        "flex gap-24 transition-all duration-[1500ms] transform",
        showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <button
          className="text-7xl font-light text-accent/30 hover:text-primary transition-all duration-700 hover:scale-125 focus:outline-none"
          onMouseEnter={() => onHover('yes')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onChoice('yes')}
          aria-label="Commit"
        >
          ◯
        </button>
        <button
          className="text-7xl font-light text-accent/30 hover:text-primary transition-all duration-700 hover:scale-125 focus:outline-none"
          onMouseEnter={() => onHover('no')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onChoice('no')}
          aria-label="Discard"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ChoiceOverlay;
