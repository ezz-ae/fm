"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import MotionCanvas from './motion-canvas';
import { AppState } from '@/lib/types';

const LifeFrequency = ({ onComplete }: { onComplete: (shapes: string[]) => void }) => {
  const [step, setStep] = useState(0);
  const [capturedShapes, setCapturedShapes] = useState<string[]>([]);
  const prompts = ["Fear", "Ambition", "Stability", "Chaos"];

  const handleCapture = (canvasData: string) => {
    const newShapes = [...capturedShapes, canvasData];
    setCapturedShapes(newShapes);
    if (step < prompts.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newShapes);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-8">
      <div className="max-w-xl w-full text-center space-y-12">
        <div className="space-y-4 animate-in fade-in duration-1000">
           <p className="text-primary/20 tracking-[1em] uppercase text-[10px]">Life Frequency Mapping</p>
           <h2 className="text-primary text-4xl font-light italic">Draw the shape of your <span className="text-primary font-bold">{prompts[step]}</span></h2>
        </div>

        <div className="relative aspect-square w-full border border-primary/5 rounded-2xl overflow-hidden bg-primary/[0.01]">
          <MotionCanvas 
            appState={AppState.DRAWING} 
            onDrawStart={() => {}} 
            onPause={handleCapture}
            onReleaseComplete={() => {}}
          />
        </div>

        <p className="text-primary/10 text-[8px] tracking-[0.6em] uppercase">Pause to finalize the mapping</p>
      </div>
    </div>
  );
};

export default LifeFrequency;
