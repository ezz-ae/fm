"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Shield, Zap, Waves, ArrowRight } from 'lucide-react';
import MotionCanvas from '@/components/motion-canvas';
import { AppState, StrokeMetrics } from '@/lib/types';

export default function MateOnboarding() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin') || 'Unknown';
  const [stage, setStage] = useState<'intro' | 'calibration' | 'sync' | 'complete'>('intro');
  const [metrics, setMetrics] = useState<StrokeMetrics | null>(null);

  const handleStart = () => setStage('calibration');
  
  const handleMetrics = (m: StrokeMetrics) => {
    setMetrics(m);
    // Simulate sync delay
    setTimeout(() => setStage('sync'), 1500);
  };

  const handleSyncComplete = () => {
    setTimeout(() => setStage('complete'), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-primary p-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] animate-pulse" />

      {stage === 'intro' && (
        <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">
           <div className="space-y-6">
             <div className="w-16 h-16 mx-auto border border-primary/20 rounded-full flex items-center justify-center animate-spin-slow">
               <Waves size={24} className="text-primary/40" />
             </div>
             <div className="space-y-2">
                <p className="text-primary/20 tracking-[0.6em] uppercase text-[10px]">Frequency Estate Invite</p>
                <h1 className="text-4xl font-light italic">Sync with <span className="font-bold not-italic">@{origin}</span></h1>
             </div>
             <p className="text-primary/40 text-sm font-light leading-relaxed">
               You have been invited to a shared frequency estate. Your motion will be calibrated against the host's signal to create a unified resonance report.
             </p>
           </div>
           <button 
             onClick={handleStart}
             className="group relative px-12 py-4 border border-primary/20 hover:border-primary transition-all duration-500 overflow-hidden"
           >
             <span className="relative z-10 text-[10px] tracking-[0.4em] uppercase group-hover:text-black transition-colors">Accept Signal</span>
             <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
           </button>
        </div>
      )}

      {stage === 'calibration' && (
        <div className="w-full h-full max-w-2xl relative animate-in fade-in duration-1000">
           <div className="absolute top-0 left-0 w-full text-center py-8 z-10">
              <p className="text-primary/20 tracking-[0.8em] uppercase text-[10px] animate-pulse">Calibrating to @{origin}</p>
           </div>
           <div className="w-full h-full border border-primary/5 rounded-3xl overflow-hidden bg-primary/[0.01]">
              <MotionCanvas 
                appState={AppState.DRAWING} 
                onDrawStart={() => {}} 
                onPause={() => {}} 
                onReleaseComplete={() => {}}
                onMetricsCaptured={handleMetrics}
              />
           </div>
        </div>
      )}

      {stage === 'sync' && (
        <div className="text-center space-y-8 animate-in fade-in duration-1000" onAnimationEnd={handleSyncComplete}>
           <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping [animation-duration:3s]" />
              <div className="absolute inset-8 border border-primary/40 rounded-full animate-ping [animation-duration:2s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Zap size={32} className="text-primary animate-pulse" />
              </div>
           </div>
           <p className="text-xl font-light italic">Merging signals...</p>
           <div className="h-px w-64 bg-primary/10 mx-auto overflow-hidden">
              <div className="h-full bg-primary/40 animate-progress" />
           </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="max-w-lg w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">
           <div className="space-y-4">
              <Shield size={48} className="mx-auto text-primary/40" />
              <h2 className="text-3xl font-light tracking-tight">Resonance Established</h2>
              <p className="text-primary/40 text-sm leading-relaxed">
                Your frequency has been harmonized with @{origin}. A shared execution report has been generated for both nodes.
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4 text-left p-8 border border-primary/10 bg-primary/[0.02]">
              <div>
                 <p className="text-[10px] uppercase tracking-widest text-primary/30">Sync Level</p>
                 <p className="text-2xl font-light">94.2%</p>
              </div>
              <div>
                 <p className="text-[10px] uppercase tracking-widest text-primary/30">Estate Type</p>
                 <p className="text-2xl font-light">Amplified</p>
              </div>
           </div>

           <button onClick={() => window.location.href = '/'} className="text-primary/40 hover:text-primary text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-4 transition-colors">
             Enter Your Own Estate <ArrowRight size={14} />
           </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-progress { animation: progress 3s ease-out forwards; }
      `}</style>
    </div>
  );
}
