"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Instagram, ArrowRight, Fingerprint } from 'lucide-react';

const InstagramPrompt = ({ onComplete }: { onComplete: (handle: string) => void }) => {
  const [handle, setHandle] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full space-y-16 text-center animate-in fade-in slide-in-from-bottom-12 duration-[1500ms]">
        <div className="space-y-6">
          <Fingerprint size={48} className="mx-auto text-primary/20 animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-primary text-xl font-light tracking-[0.6em] uppercase">Attribute Signal</h2>
            <p className="text-primary/20 text-xs font-light tracking-widest uppercase">
              Merging motion trace with digital origin
            </p>
          </div>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handle && onComplete(handle); }}
          className="relative group"
        >
          <input
            autoFocus
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full bg-transparent border-b border-primary/10 py-6 text-center text-primary text-2xl font-light focus:outline-none focus:border-primary/40 transition-all placeholder:text-primary/[0.03] tracking-widest"
            placeholder="@IDENTITY"
          />
          <button 
            disabled={!handle}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-all duration-500 disabled:opacity-0 translate-x-4 group-hover:translate-x-0"
          >
            <ArrowRight size={24} />
          </button>
        </form>

        <p className="text-primary/10 text-[8px] tracking-[1em] uppercase">This attribution is permanent</p>
      </div>
    </div>
  );
};

export default InstagramPrompt;
