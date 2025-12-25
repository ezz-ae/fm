"use client";

import { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

const CodeVerification = ({ email, onComplete }: { email: string, onComplete: () => void }) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Simulate sending code
    console.log(`Sending magic code to ${email}...`);
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length >= 4) {
      setIsVerifying(true);
      // Simulate verification delay
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 bg-background/95 backdrop-blur-md">
      <div className="max-w-md w-full space-y-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="space-y-4">
          <Lock size={48} className="mx-auto text-primary/40" />
          <h2 className="text-primary text-2xl font-light tracking-widest uppercase">Verify Signal</h2>
          <p className="text-primary/30 text-sm font-light leading-relaxed">
            Enter the sequence sent to <span className="text-primary/60">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative group max-w-[200px] mx-auto">
          <input
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-transparent border-b-2 border-primary/20 py-4 text-center text-primary text-4xl font-mono tracking-[0.5em] focus:outline-none focus:border-primary/60 transition-all placeholder:text-primary/5"
            placeholder="0000"
            maxLength={6}
          />
          {isVerifying && (
             <div className="absolute top-full left-0 w-full pt-4">
               <div className="h-1 bg-primary/10 w-full overflow-hidden rounded-full">
                 <div className="h-full bg-primary/60 animate-progress" />
               </div>
             </div>
          )}
        </form>
      </div>
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress { animation: progress 1.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CodeVerification;
