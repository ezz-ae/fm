"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Activity, Shield, Zap, Target, Users, Share2, Camera, Waves, Lock, CheckCircle2, ChevronRight, Bookmark, Link as LinkIcon, UserPlus, PlayCircle, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { StrokeMetrics } from '@/lib/types';
import PayPalIntegration from './paypal-integration';
import Link from 'next/link';

const ProfileReveal = ({ 
  handle, 
  intensity, 
  userDrawing,
  metrics
}: { 
  handle: string, 
  intensity: number, 
  userDrawing: string | null,
  metrics: StrokeMetrics | null
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [timerProgress, setTimerProgress] = useState(100);
  const [copied, setCopied] = useState(false);
  const [executingExp, setExecutingExp] = useState<string | null>(null);

  useEffect(() => {
    const paidStatus = localStorage.getItem(`aimas_paid_${handle}`);
    if (paidStatus) {
      const { timestamp } = JSON.parse(paidStatus);
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      
      if (now - timestamp < thirtyDays) {
        setIsPaid(true);
        return;
      } else {
        localStorage.removeItem(`aimas_paid_${handle}`);
      }
    }

    const duration = 60000; 
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      setTimerProgress(100 - (elapsed / duration) * 100);
      
      if (elapsed >= duration) {
        clearInterval(interval);
        if (!isPaid) setShowPayment(true);
      }
    }, intervalTime);

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearInterval(interval);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isPaid, handle]);

  const handlePaymentSuccess = (details: any) => {
    setIsPaid(true);
    setShowPayment(false);
    localStorage.setItem(`aimas_paid_${handle}`, JSON.stringify({
      timestamp: Date.now(),
      orderId: details.id
    }));
  };

  const generatePartnerLink = () => {
    const mateID = Math.random().toString(36).substring(7);
    const link = `${window.location.origin}/mate/${mateID}?origin=${handle}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteExperience = (exp: string, price: number) => {
    if (!isPaid) {
      // Shake effect or visual feedback could go here
      return; 
    }
    
    setExecutingExp(exp);
    
    // Simulate Protocol Injection / Backend Update
    // In a real app, this POSTs to the API
    const nodeKey = Object.keys(localStorage).find(k => k.includes(handle));
    if (nodeKey) {
      const nodeData = JSON.parse(localStorage.getItem(nodeKey)!);
      nodeData.lastAction = `Executing ${exp}`;
      nodeData.usageCost = (nodeData.usageCost || 0) + (price > 0 ? price : 0.1); // Usage cost tracking
      localStorage.setItem(nodeKey, JSON.stringify(nodeData));
    }

    setTimeout(() => {
      setExecutingExp(null);
      // Could redirect or show success state
    }, 2000);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 overflow-y-auto bg-background text-primary selection:bg-transparent transition-all duration-1000 scroll-smooth",
      showPayment && "blur-md pointer-events-none scale-95"
    )}>
      {!isPaid && (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-primary/5">
          <div 
            className="h-full bg-primary/40 transition-all duration-100 linear"
            style={{ width: `${timerProgress}%` }}
          />
        </div>
      )}

      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative space-y-24 md:space-y-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-primary/10 pb-12 gap-8 md:gap-12">
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 md:w-12 md:h-12 border border-primary/20 flex items-center justify-center font-black text-xl md:text-2xl">A</div>
               <div className="h-px w-8 md:w-12 bg-primary/20" />
               <span className="text-[8px] md:text-[10px] tracking-[0.6em] md:tracking-[0.8em] uppercase text-primary/40">Execution Result</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter lowercase break-all">@{handle}</h1>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto justify-between md:justify-end gap-8 md:gap-16 items-start md:items-end">
            <div className="text-left md:text-right">
              <div className="text-primary/60 text-4xl md:text-6xl font-light tracking-tighter">{intensity}x</div>
              <p className="text-primary/20 text-[8px] md:text-[10px] tracking-widest uppercase">Resolution</p>
            </div>
            <Link href="/frequency" className="group flex items-center gap-2 text-primary/40 hover:text-primary transition-colors text-[10px] uppercase tracking-widest">
              <BookOpen size={14} className="group-hover:scale-110 transition-transform"/>
              The Law
            </Link>
          </div>
        </header>

        {/* Partner Frequency Estate Invite */}
        <section className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
           <div className="flex items-center gap-4 text-primary/30 uppercase tracking-[0.4em] text-[10px] md:text-xs">
            <UserPlus size={14} /> Partner Frequency Estate
          </div>
          <div className="bg-primary/[0.03] border border-primary/20 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-2 max-w-md text-center md:text-left">
                <h4 className="text-lg font-light tracking-tight">Sync with a partner</h4>
                <p className="text-[10px] md:text-xs text-primary/40 leading-relaxed uppercase tracking-widest">
                  Invite a collaborator to practice in this frequency.
                </p>
             </div>
             <button 
              onClick={generatePartnerLink}
              className={cn(
                "w-full md:w-auto px-8 py-4 border transition-all duration-500 flex items-center justify-center gap-4 text-[10px] tracking-[0.4em] uppercase touch-manipulation",
                copied ? "bg-green-500/20 border-green-500/40 text-green-500" : "border-primary/20 hover:border-primary text-primary/60 hover:text-primary"
              )}
             >
               {copied ? "Link Captured" : "Generate Invite"} <LinkIcon size={14} />
             </button>
          </div>
        </section>

        {/* Available Waves - THE STORE */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 text-primary/30 uppercase tracking-[0.4em] text-[10px] md:text-xs">
            <Waves size={14} /> Protocol Inventory
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { id: 'decision', title: 'Decision Lock', price: 0, desc: 'Secure the current resolve into your history.' },
              { id: 'learning', title: 'Neural Learning', price: 0, desc: 'Align your motion with new cognitive intake.' },
              { id: 'collective', title: 'Collective Wave', price: 5, desc: 'Join the synchronized global pulse.' }
            ].map((w, i) => (
              <div key={i} className="p-6 md:p-8 border border-primary/5 space-y-6 hover:border-primary/20 transition-all bg-primary/[0.01] group relative overflow-hidden active:scale-[0.98] duration-200">
                <div className="flex justify-between items-start">
                   <h4 className="text-lg font-light group-hover:text-primary transition-colors">{w.title}</h4>
                   <span className="text-[10px] font-mono text-primary/40 border border-primary/10 px-2 py-1">
                     ${w.price.toFixed(2)}
                   </span>
                </div>
                <p className="text-primary/40 text-xs leading-relaxed">{w.desc}</p>
                
                <button 
                  onClick={() => handleExecuteExperience(w.title, w.price)}
                  disabled={!!executingExp}
                  className="w-full py-4 border-t border-primary/10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-primary/40 hover:text-primary hover:bg-primary/5 transition-all touch-manipulation disabled:opacity-50"
                >
                  {executingExp === w.title ? (
                    <span className="animate-pulse">Injecting...</span>
                  ) : isPaid ? (
                    <><PlayCircle size={14} /> Execute</>
                  ) : (
                    <><Lock size={14} /> Locked</>
                  )}
                </button>
                
                {/* Execution Progress Bar */}
                {executingExp === w.title && (
                  <div className="absolute bottom-0 left-0 h-1 bg-primary w-full animate-progress" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="space-y-12">
           <div className="flex items-center gap-4 text-primary/30 uppercase tracking-[0.4em] text-[10px] md:text-xs">
            <Bookmark size={14} /> Frequency Recommendations
          </div>
          <div className="bg-primary/[0.02] border border-primary/10 p-8 md:p-12 rounded-3xl space-y-8">
             <p className="text-lg md:text-2xl font-light leading-relaxed italic text-primary/60">
                "Based on your high Excitement Factor ({(metrics?.excitementLevel || 9.2).toFixed(1)}), the Protocol recommends the <span className="text-primary underline decoration-primary/20">Decision Lock</span> experience."
             </p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-32">
           {[
             { label: 'Decision Logic', val: metrics?.velocityVariance && metrics.velocityVariance < 0.5 ? 'Resolved' : 'Fragmented' },
             { label: 'Neural Clarity', val: `${((metrics?.pressureEstimate || 0) * 100).toFixed(0)}%` },
             { label: 'Motion Weight', val: metrics?.density.toFixed(2) },
             { label: 'Excitement', val: metrics?.excitementLevel ? metrics.excitementLevel.toFixed(1) : '9.2' }
           ].map((m, i) => (
             <div key={i} className="border border-primary/10 p-4 md:p-6 space-y-2 bg-primary/[0.01]">
               <p className="text-[8px] tracking-[0.4em] uppercase text-primary/30">{m.label}</p>
               <p className="text-xl md:text-2xl font-light tracking-tighter break-words">{m.val}</p>
             </div>
           ))}
        </section>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl pointer-events-auto p-6 md:p-8 animate-in fade-in duration-1000">
          <div className="max-w-md w-full text-center space-y-8 md:space-y-12">
             <div className="space-y-4">
               <p className="text-primary/40 tracking-[0.6em] uppercase text-xs">Final Execution</p>
               <h2 className="text-primary text-3xl md:text-4xl font-light italic">Secure the Signal?</h2>
               <p className="text-primary/30 text-sm font-light">
                 $10 unlocks full protocol access for 30 days.
               </p>
             </div>
             
             <div className="py-4 md:py-8">
                <PayPalIntegration 
                  amount="10.00" 
                  onSuccess={handlePaymentSuccess} 
                  onCancel={() => window.location.href = '/'} 
                />
             </div>

             <button onClick={() => window.location.href = '/'} className="text-primary/10 hover:text-primary/30 text-[8px] tracking-[1em] uppercase transition-colors p-4 touch-manipulation">Refusal Purges Signal</button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress { animation: progress 2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ProfileReveal;
