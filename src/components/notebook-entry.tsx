"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Pencil, ChevronRight } from 'lucide-react';

const NotebookEntry = ({
  message,
  isGenerating = false,
  round = 1,
  onUserReply,
  onStartDrawing,
}: {
  message: string;
  isGenerating?: boolean;
  round?: number;
  onUserReply?: (reply: string) => void;
  onStartDrawing?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isStorming, setIsStorming] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (isGenerating) {
      setDisplayedText("...");
      setIsVisible(true);
      setShowInput(false);
      setIsStorming(true);
      return;
    }

    if (message) {
      setDisplayedText('');
      setIsVisible(true);
      setShowInput(false);
      setIsStorming(true);

      const words = message.split(' ');
      let currentWords: string[] = [];
      let wordIndex = 0;
      
      const typeWord = () => {
        if (wordIndex < words.length) {
          currentWords.push(words[wordIndex]);
          setDisplayedText(currentWords.join(' '));
          wordIndex++;
          timeoutRef.current = setTimeout(typeWord, 80 + Math.random() * 50);
        } else {
            setIsStorming(false);
            timeoutRef.current = setTimeout(() => {
              setShowInput(true);
            }, 400);
        }
      };
      
      timeoutRef.current = setTimeout(typeWord, 400);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [message, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && onUserReply) {
      onUserReply(userInput);
      setUserInput('');
      setShowInput(false);
    }
  };
  
  return (
    <div className={cn(
      "fixed inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000 p-4",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Round Indicator - Writing on the left, appearing on the right */}
      {round > 1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {/* The "Writing" motion on the left */}
           <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[20rem] font-black text-primary/[0.03] italic -skew-x-12 animate-in slide-in-from-left-20 duration-[3000ms]">
             {round}
           </div>
           {/* The "Appearance" on the right */}
           <div className="absolute right-20 bottom-20 text-6xl font-light text-primary/10 tracking-tighter animate-in slide-in-from-right-10 fade-in duration-[2000ms] delay-1000">
             #{round}
           </div>
        </div>
      )}

      <div className="relative w-full max-w-xl text-center space-y-16">
        <p className={cn(
          "text-sm md:text-base text-primary/60 font-light tracking-[0.3em] uppercase transition-all duration-1000",
          isStorming ? "blur-md opacity-0" : "blur-none opacity-100"
        )}>
          {displayedText}
        </p>

        <div className={cn(
          "transition-all duration-1000 transform",
          showInput ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          <div className="flex items-center justify-center gap-6">
             <button 
              onClick={onStartDrawing}
              className="p-3 rounded-full border border-primary/20 text-primary/40 hover:text-primary hover:border-primary/60 transition-all group"
            >
              <Pencil size={18} className="group-hover:scale-110 transition-transform" />
            </button>
            
            <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/30">
                <ChevronRight size={16} />
              </span>
              <input
                type="text"
                autoFocus
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="write..."
                className="w-full bg-transparent border-b border-primary/10 pl-6 pr-2 py-2 text-primary text-lg font-light focus:outline-none focus:border-primary/40 transition-all placeholder:text-primary/10 tracking-widest"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookEntry;
