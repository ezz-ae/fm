"use client";

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const EmailCapture = ({ onComplete }: { onComplete: (email: string) => void }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 bg-background/95 backdrop-blur-md">
      <div className="max-w-md w-full space-y-12 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="space-y-4">
          <Mail size={48} className="mx-auto text-primary/40 animate-pulse" />
          <h2 className="text-primary text-2xl font-light tracking-widest uppercase">Archive Destination</h2>
          <p className="text-primary/30 text-sm font-light leading-relaxed">
            Where should the protocol send your key?
          </p>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); email && onComplete(email); }}
          className="relative group"
        >
          <input
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-primary/10 py-4 text-center text-primary text-xl focus:outline-none focus:border-primary/40 transition-all placeholder:text-primary/5 tracking-widest"
            placeholder="SIGNAL@PROTOCOL.COM"
          />
          <button 
            disabled={!email.includes('@')}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-all duration-500 disabled:opacity-0 translate-x-4 group-hover:translate-x-0"
          >
            <ArrowRight size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailCapture;
