"use client";

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

const MemoryGame = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'exposure' | 'trick' | 'reveal'>('exposure');
  const [timer, setTimer] = useState(4);
  const [userInput, setUserInput] = useState('');
  
  const symbols = useMemo(() => ['◯', '✕', '△', '□', '◇'].sort(() => Math.random() - 0.5), []);

  useEffect(() => {
    if (stage === 'exposure') {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setStage('trick');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleTrickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage('reveal');
    setTimeout(onComplete, 3000);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl p-8 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

      {stage === 'exposure' && (
        <div className="text-center space-y-16 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-4">
            <p className="text-primary/30 tracking-[0.6em] uppercase text-xs">Calibrating Retention...</p>
            <div className="h-1 w-64 bg-primary/10 mx-auto overflow-hidden">
               <div 
                className="h-full bg-primary/40 transition-all duration-1000 ease-linear" 
                style={{ width: `${(4 - timer) * 25}%` }} 
               />
            </div>
          </div>
          <div className="flex gap-12">
            {symbols.map((s, i) => (
              <div 
                key={i} 
                className="text-7xl text-primary font-light transition-all duration-700"
                style={{ 
                  filter: `blur(${timer === 0 ? 20 : 0}px)`,
                  transform: `translateY(${Math.sin(timer + i) * 10}px)`,
                  opacity: 0.2 + (timer / 4)
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === 'trick' && (
        <div className="text-center space-y-12 max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-6">
            <h2 className="text-primary/80 text-3xl font-light tracking-tight leading-snug">
              Retain the sequence.
            </h2>
            <p className="text-primary/40 text-lg font-light italic">
              It will be requested later.
            </p>
          </div>
          
          <div className="space-y-8">
            <p className="text-primary text-2xl font-light leading-relaxed">
              Now, describe the <span className="italic underline decoration-primary/20">intent</span> behind your very first stroke today.
            </p>
            
            <form onSubmit={handleTrickSubmit} className="relative group">
              <input 
                autoFocus
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full bg-transparent border-b border-primary/10 py-4 text-center text-primary text-xl focus:outline-none focus:border-primary/40 transition-all placeholder:text-primary/5"
                placeholder="what did you mean to say?"
              />
              <div className="absolute -bottom-px left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000" />
            </form>

            <button 
              type="button"
              onClick={() => { setStage('reveal'); setTimeout(onComplete, 2000); }}
              className="text-primary/20 hover:text-primary/40 text-xs tracking-[0.3em] uppercase transition-colors"
            >
              The intent is gone
            </button>
          </div>
        </div>
      )}

      {stage === 'reveal' && (
        <div className="text-center animate-in fade-in zoom-in duration-1000">
           <p className="text-primary/60 text-4xl font-light italic tracking-widest">
            {userInput ? "Noted." : "True."}
           </p>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
