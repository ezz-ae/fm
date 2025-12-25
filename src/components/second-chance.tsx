"use client";

import { Button } from './ui/button';

const SecondChance = ({ onReset }: { onReset: () => void }) => {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-background fade-in">
      <Button
        variant="ghost"
        className="group text-5xl font-light text-accent hover:bg-transparent hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300"
        onClick={onReset}
        aria-label="Start over"
      >
        <span className="transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse">◯</span>
      </Button>
    </div>
  );
};

export default SecondChance;
