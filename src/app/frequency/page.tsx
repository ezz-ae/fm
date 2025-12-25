"use client";

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Waves, Heart, Music, Brain, Globe, Shield, Zap, Users, Radio, Menu, X } from 'lucide-react';
import Link from 'next/link';

const states = [
  { id: 'static', label: 'Static', color: 'text-blue-400', desc: 'Low-velocity stability.' },
  { id: 'resonant', label: 'Resonant', color: 'text-green-400', desc: 'Harmonic rhythmic alignment.' },
  { id: 'vibrant', label: 'Vibrant', color: 'text-yellow-400', desc: 'High-frequency intentional chaos.' },
  { id: 'void', label: 'Void', color: 'text-purple-400', desc: 'Absolute silence in motion.' }
];

export default function FrequencyPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const nodeCounts = useMemo(() => ({
    static: 142,
    resonant: 89,
    vibrant: 256,
    void: 31
  }), []);

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-primary/20 p-6 md:p-24 selection:text-background overflow-x-hidden">
      {/* Mobile Navigation */}
      <nav className="fixed top-6 right-6 z-[100]">
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-primary/60 p-2">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={cn(
          "md:flex gap-8 transition-all duration-500",
          menuOpen 
            ? "absolute top-12 right-0 flex flex-col items-end bg-black/90 p-8 border border-primary/10 rounded-xl backdrop-blur-xl" 
            : "hidden md:flex"
        )}>
          <Link href="/" className="text-[10px] uppercase tracking-[0.5em] text-primary/40 hover:text-primary transition-colors whitespace-nowrap">Adaptor</Link>
          <Link href="/frequency" className="text-[10px] uppercase tracking-[0.5em] text-primary transition-colors whitespace-nowrap">The Law</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto space-y-24 md:space-y-32">
        <header className="space-y-8 mt-12 md:mt-0">
          <div className="flex items-center gap-4">
            <div className="w-8 md:w-12 h-px bg-primary/20" />
            <span className="text-[8px] md:text-[10px] tracking-[0.6em] md:tracking-[0.8em] uppercase text-primary/40 italic">Universal Operating Code</span>
          </div>
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter lowercase leading-[0.8]">the law of frequency</h1>
          <p className="text-xl md:text-4xl font-light italic leading-tight text-primary/80">
            Frequency is the hidden governor of reality. It is the code of our cells and the driver of our memories.
          </p>
        </header>

        {/* Community Resonance Section */}
        <section className="space-y-12 md:space-y-16 border-y border-primary/10 py-16 md:py-24">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-primary/30 uppercase tracking-[0.4em] text-[10px] md:text-xs">
              <Radio size={16} className="animate-pulse" /> Live Resonance
            </div>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight">Identify your current state</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {states.map((state) => (
              <button
                key={state.id}
                onClick={() => setSelectedState(state.id)}
                className={cn(
                  "p-6 md:p-8 border transition-all duration-700 text-left space-y-4 md:space-y-6 group relative overflow-hidden active:scale-95",
                  selectedState === state.id 
                    ? "border-primary bg-primary/[0.03]" 
                    : "border-primary/5 hover:border-primary/20"
                )}
              >
                <div className="flex justify-between items-start">
                   <h3 className={cn("text-lg md:text-xl font-light tracking-widest uppercase", state.color)}>
                     {state.label}
                   </h3>
                   <span className="text-[10px] font-mono text-primary/20">
                     {nodeCounts[state.id as keyof typeof nodeCounts]} nodes
                   </span>
                </div>
                <p className="text-[10px] text-primary/40 leading-relaxed uppercase tracking-widest">
                  {state.desc}
                </p>
                {selectedState === state.id && (
                  <div className="absolute bottom-0 left-0 h-1 bg-primary animate-out slide-in-from-left duration-1000 w-full" />
                )}
              </button>
            ))}
          </div>

          {selectedState && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <p className="text-primary/60 text-xs md:text-sm font-light italic px-4">
                 You are resonating with {nodeCounts[selectedState as keyof typeof nodeCounts]} others in the <span className="text-primary font-bold uppercase tracking-widest">{selectedState}</span> wave.
               </p>
            </div>
          )}
        </section>

        {/* Section I */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-8 md:pt-16">
          <div className="space-y-6">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold text-primary/40">I. Measurement of Familiarity</h2>
            <p className="text-base md:text-lg font-light leading-relaxed">
              Meaning only enters when a signal repeats enough times to become a recognized pattern. 
              A single moment is noise. Frequency is familiarity measured by repetition.
            </p>
          </div>
          <div className="bg-primary/[0.02] p-6 md:p-8 space-y-4 rounded-xl border border-primary/5">
             <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-primary/30">
               <Zap size={14} /> The Recognition Chain
             </div>
             <div className="space-y-2 text-sm font-light">
               <p>1. <span className="text-primary/60">Repetition:</span> Event occurs twice.</p>
               <p>2. <span className="text-primary/60">Frequency:</span> System detects the rate.</p>
               <p>3. <span className="text-primary/60">Recognition:</span> Brain identifies pattern.</p>
               <p>4. <span className="text-primary/60">Meaning:</span> Value is assigned.</p>
             </div>
          </div>
        </section>

        {/* Section II */}
        <section className="space-y-8 md:space-y-12">
          <div className="flex items-center gap-4">
             <Music size={24} className="text-primary/20" />
             <h2 className="text-2xl md:text-3xl font-light tracking-tight">II. Biological Communication</h2>
          </div>
          <p className="text-lg md:text-2xl font-light text-primary/60 leading-relaxed max-w-2xl">
            Music possesses no words, yet it triggers adrenaline or serotonin. 
            You are not "feeling" the music; your nervous system is simply <span className="text-primary italic">aligning with its frequency.</span>
          </p>
        </section>

        {/* Section III */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
           <div className="space-y-8">
             <h2 className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold text-primary/40">III. Behavioral Environments</h2>
             <p className="font-light leading-relaxed text-base md:text-lg">
               The brain reads the environmental intensity field—noise levels and social cues. 
               Adaptation is the act of aligning your internal frequency with this external field. 
               When you feel "at home," you have entered a frequency you have learned to trust.
             </p>
           </div>
           <div className="aspect-square w-32 md:w-full mx-auto md:mx-0 border border-primary/5 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 border border-primary/10 rounded-full animate-ping [animation-duration:4s]" />
              <Globe size={48} className="text-primary/10" />
           </div>
        </section>

        {/* Section IV */}
        <section className="space-y-8 md:space-y-12 border-t border-primary/10 pt-12 md:pt-16">
          <div className="flex items-center gap-4">
             <Brain size={24} className="text-primary/20" />
             <h2 className="text-2xl md:text-3xl font-light tracking-tight">IV. Frequency Logs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2 space-y-6">
              <p className="text-base md:text-lg font-light leading-relaxed">
                Memory is not a video file. It is a frequency log. 
                The brain saves the <span className="text-primary font-bold">energetic state</span> you were in when it happened.
              </p>
              <p className="text-primary/50 font-light italic">
                Recalling is "relocating" your mind back to that past frequency. 
                Forgetting is simply "Fade-In"—dissolving detail to integrate intelligence.
              </p>
            </div>
            <div className="flex flex-col gap-4">
               <div className="h-1 bg-primary/20" />
               <div className="h-1 bg-primary/10" />
               <div className="h-1 bg-primary/5" />
            </div>
          </div>
        </section>

        {/* Section V */}
        <footer className="pt-12 md:pt-24 pb-24 md:pb-48 space-y-12 md:space-y-16">
           <h2 className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold text-primary/40 text-center">V. Systemic Invariants</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             <div className="p-6 md:p-8 border border-primary/5 space-y-4">
                <p className="text-[10px] tracking-widest uppercase text-primary/20">Invariant 01</p>
                <p className="text-xs md:text-sm font-light">Speed Has No Identity. The system evaluates energy, not character.</p>
             </div>
             <div className="p-6 md:p-8 border border-primary/5 space-y-4">
                <p className="text-[10px] tracking-widest uppercase text-primary/20">Invariant 02</p>
                <p className="text-xs md:text-sm font-light">Limitation Creates Meaning. Distinct frequencies form from boundaries.</p>
             </div>
             <div className="p-6 md:p-8 border border-primary/5 space-y-4">
                <p className="text-[10px] tracking-widest uppercase text-primary/20">Invariant 03</p>
                <p className="text-xs md:text-sm font-light">Human Variability. Every node brings a unique Frequency Fingerprint.</p>
             </div>
           </div>
        </footer>
      </div>
    </div>
  );
}
