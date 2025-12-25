"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

const InterestSelection = ({ onSelect }: { onSelect: (interest: string) => void }) => {
  const interests = [
    'History', 'Fashion', 'Psychology', 'Art', 
    'Math', 'Design', 'Health', 'Media', 
    'Sales', 'Music', 'Games'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-background/40 backdrop-blur-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl animate-in fade-in zoom-in duration-1000">
        {interests.map((interest, i) => (
          <button
            key={interest}
            onClick={() => onSelect(interest)}
            className="group relative px-6 py-4 text-primary/40 hover:text-primary transition-all duration-500 text-sm tracking-[0.4em] uppercase"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="relative z-10">{interest}</span>
            <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 scale-90 group-hover:scale-100 transition-all duration-500 rounded-lg" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default InterestSelection;
