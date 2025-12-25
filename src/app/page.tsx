"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AppState, StrokeMetrics } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import MotionCanvas from '@/components/motion-canvas';
import ChoiceOverlay from '@/components/choice-overlay';
import NotebookEntry from '@/components/notebook-entry';
import SecondChance from '@/components/second-chance';
import ValuationGame from '@/components/valuation-game';
import MemoryGame from '@/components/memory-game';
import LifeFrequency from '@/components/life-frequency';
import MazeChallenge from '@/components/maze-challenge';
import InterestSelection from '@/components/interest-selection';
import InstagramPrompt from '@/components/instagram-prompt';
import EmailCapture from '@/components/email-capture';
import CodeVerification from '@/components/code-verification';
import LandingPage from '@/components/landing-page';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { generateNotebookEntry } from '@/ai/flows/generate-notebook-entry';
import { continueConversation } from '@/ai/flows/continue-conversation';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [round, setRound] = useState(1);
  const [resetCanvasKey, setResetCanvasKey] = useState(0);
  const [userDrawing, setUserDrawing] = useState<string | null>(null);
  const [choiceHover, setChoiceHover] = useState<'yes' | 'no' | null>(null);
  const [notebookMessage, setNotebookMessage] = useState('');
  const [showUI, setShowUI] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', content: string}[]>([]);
  const [intensity, setIntensity] = useState(1);
  const [metrics, setMetrics] = useState<StrokeMetrics | null>(null);
  
  const [userInterest, setUserInterest] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [lifeShapes, setLifeShapes] = useState<string[]>([]);

  useEffect(() => {
    // Check local session first
    const hasActiveSession = localStorage.getItem('aimas_active_session');
    if (hasActiveSession) {
      setAppState(AppState.DRAWING);
    }
  }, []);

  const fieldBoards = useMemo(() => PlaceHolderImages.map((img, i) => ({
    ...img,
    width: 400 + (Math.sin(i) * 100 + 100),
    height: 500 + (Math.cos(i) * 100 + 100),
    top: Math.sin(i * 2) * 80,
    left: Math.cos(i * 3) * 50,
    opacity: 0.15 + (Math.abs(Math.sin(i)) * 0.2),
    rotation: Math.sin(i * 5) * 8,
    scale: 0.85 + (Math.abs(Math.cos(i)) * 0.15),
    blur: 1 + (Math.abs(Math.sin(i)) * 3)
  })), []);

  const handleLandingStart = () => {
    localStorage.setItem('aimas_active_session', 'true');
    setAppState(AppState.CALIBRATING);
    setTimeout(() => {
       setAppState(AppState.FREQUENCY_CONTENT);
    }, 1500);
  };

  const handleFrequencyReady = () => {
    setAppState(AppState.DRAWING);
  };

  const handleDrawStart = () => {
    if (appState !== AppState.DRAWING) setAppState(AppState.DRAWING);
  };

  const handlePause = (canvasDataUrl: string) => {
    setUserDrawing(canvasDataUrl);
    setAppState(AppState.RELEASE);
  };

  const handleReleaseComplete = () => {
    setAppState(AppState.FIELD);
  };

  const handleMetricsCaptured = (newMetrics: StrokeMetrics) => {
    const excitement = (newMetrics.velocityVariance * 10) + (newMetrics.density / 2);
    setMetrics({ ...newMetrics, excitementLevel: excitement });
  };

  const handleChoice = async (choice: 'yes' | 'no') => {
    setChoiceHover(null);
    setShowUI(false);
    if (choice === 'yes') {
      setAiGenerating(true);
      setAppState(AppState.NOTEBOOK_ENTRY);
      try {
        const result = await generateNotebookEntry({});
        setNotebookMessage(result.message || "Creativity flows.");
        setChatHistory([{role: 'model', content: result.message || "Creativity flows."}]);
      } catch (error) {
        setNotebookMessage("Creativity flows.");
      } finally {
        setAiGenerating(false);
      }
    } else {
      setAppState(AppState.FADE_TO_BLACK);
    }
  };

  const handleUserReply = async (reply: string) => {
    const r = reply.toLowerCase();
    
    if (round === 1 && chatHistory.length >= 2) {
       setAppState(AppState.LIFE_FREQUENCY);
       return;
    }
    
    if (round === 2 && r.length > 3) {
      setAppState(AppState.MAZE_CHALLENGE);
      return;
    }

    if (r.includes('value') || r.includes('price') || r.includes('valuation')) {
      setAppState(AppState.VALUATION);
      return;
    }
    if (r.includes('game') || r.includes('play') || r.includes('memory')) {
      setAppState(AppState.MEMORY_GAME);
      return;
    }

    setAiGenerating(true);
    const updatedHistory = [...chatHistory, {role: 'user' as const, content: reply}];
    setChatHistory(updatedHistory);
    try {
      const result = await continueConversation({
        history: updatedHistory,
        userMessage: reply
      });
      setNotebookMessage(result.message);
      setChatHistory([...updatedHistory, {role: 'model' as const, content: result.message}]);
    } catch (error) {
      setNotebookMessage("The space remains quiet.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleLifeFrequencyComplete = (shapes: string[]) => {
    setLifeShapes(shapes);
    setAppState(AppState.NOTEBOOK_ENTRY);
    setNotebookMessage("The mapping is registered.");
  };

  const handleMazeComplete = () => {
    setAppState(AppState.INTEREST_SELECTION);
  };

  const handleInterestSelect = (interest: string) => {
    setUserInterest(interest);
    setAppState(AppState.INSTAGRAM_PROMPT);
  };

  const handleInstagramComplete = (handle: string) => {
    // Before going to the Profile (where payment happens), we check if we need Email
    // For now, let's inject Email Capture here as the next logical step before Profile
    setAppState(AppState.EMAIL_CAPTURE);
  };

  const handleEmailComplete = (email: string) => {
    setUserEmail(email);
    setAppState(AppState.CODE_VERIFICATION);
  };

  const handleCodeVerified = () => {
    // Now we are authenticated "magically"
    // Proceed to Profile Reveal
    const nodeID = user ? user.uid : Math.random().toString(36).substring(7);
    
    localStorage.setItem(`aimas_node_${nodeID}`, JSON.stringify({
      email: userEmail,
      intensity,
      drawing: userDrawing,
      metrics,
      lifeShapes,
      interest: userInterest,
      uid: user?.uid
    }));

    router.push(`/mas/${nodeID}`);
  };

  const handleStartDrawing = () => {
    setAppState(AppState.NOTEBOOK_DRAWING);
    setTimeout(() => setAppState(AppState.MEMORY_GAME), 4000);
  };

  const handleMemoryComplete = () => {
    setAppState(AppState.NOTEBOOK_ENTRY);
    setNotebookMessage("Recollection is its own motion.");
  };

  const handleValuationComplete = (value: number) => {
    setIntensity(prev => prev * 3);
    setRound(prev => prev + 1);
    setAppState(AppState.FADE_TO_BLACK);
  };

  const handleReset = () => {
    setAppState(AppState.RESET);
    setUserDrawing(null);
    setNotebookMessage('');
    setShowUI(false);
    setChoiceHover(null);
    setChatHistory([]);
    setMetrics(null);
    setResetCanvasKey(prev => prev + 1);
    setAiGenerating(false);
    setTimeout(() => setAppState(AppState.DRAWING), 100); 
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (appState === AppState.FIELD) {
      timer = setTimeout(() => {
        setAppState(AppState.CHOICE);
      }, 1500);
    } else if (appState === AppState.CHOICE) {
      timer = setTimeout(() => setShowUI(true), 200);
    } else if (appState === AppState.FADE_TO_BLACK) {
      timer = setTimeout(() => setAppState(AppState.SECOND_CHANCE), 1200);
    } 

    return () => clearTimeout(timer);
  }, [appState]);

  const isFieldOrChoice = appState === AppState.FIELD || appState === AppState.CHOICE;
  const isNotebookActive = appState === AppState.NOTEBOOK_ENTRY;
  const isNotebookDrawing = appState === AppState.NOTEBOOK_DRAWING;

  if (authLoading) return null; // Or a minimal loader

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      {appState === AppState.IDLE && (
        <LandingPage onStart={handleLandingStart} />
      )}

      {appState === AppState.CALIBRATING && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black animate-in fade-in duration-500">
           <p className="text-primary/40 text-xs tracking-[1.5em] uppercase animate-pulse">Calibrating Frequency...</p>
        </div>
      )}

      {appState === AppState.FREQUENCY_CONTENT && (
        <div className="fixed inset-0 z-[220] flex flex-col items-center justify-center bg-black p-8 text-center space-y-12 animate-in fade-in duration-1000">
           <div className="max-w-md space-y-6">
             <h2 className="text-primary text-3xl font-light italic">The motion you execute now is the decision you make tomorrow.</h2>
             <p className="text-primary/30 text-sm font-light leading-relaxed">
               Your physical frequency is the only honest data point left. Proceed to uncover where you belong.
             </p>
           </div>
           <button 
            onClick={handleFrequencyReady}
            className="text-primary/40 hover:text-primary transition-colors text-[10px] tracking-[1em] uppercase border border-primary/10 px-8 py-4 hover:bg-primary/[0.02]"
           >
             Enter Motion
           </button>
        </div>
      )}

      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          (appState === AppState.FADE_TO_BLACK || isNotebookActive || appState === AppState.VALUATION || appState === AppState.MEMORY_GAME || isNotebookDrawing || appState === AppState.INTEREST_SELECTION || appState === AppState.INSTAGRAM_PROMPT || appState === AppState.EMAIL_CAPTURE || appState === AppState.CODE_VERIFICATION || appState === AppState.CALIBRATING || appState === AppState.FREQUENCY_CONTENT || appState === AppState.IDLE || appState === AppState.LIFE_FREQUENCY || appState === AppState.MAZE_CHALLENGE) ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div 
          className={cn(
            "h-full w-full transition-all duration-1000 ease-in-out",
            (isNotebookActive || isNotebookDrawing) && "fold-in"
          )}
        >
          <MotionCanvas
            key={resetCanvasKey}
            appState={appState}
            intensity={intensity}
            onDrawStart={handleDrawStart}
            onPause={handlePause}
            onReleaseComplete={handleReleaseComplete}
            onMetricsCaptured={handleMetricsCaptured}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out z-10",
              choiceHover === 'yes' && 'glow',
              choiceHover === 'no' && 'dim',
              isFieldOrChoice && "w-[500px] h-[700px] m-auto shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-md border border-primary/5",
              !isFieldOrChoice && "w-full h-full",
            )}
            style={{
              transition: 'all 1.5s cubic-bezier(0.65, 0, 0.35, 1)',
              ...(isFieldOrChoice ? {
                transform: `translateX(calc(-50vw + 250px - ${PlaceHolderImages.length * 200}px)) rotateY(-5deg)`,
              } : {})
            }}
          />
        </div>

        {isFieldOrChoice && (
          <div 
            className="absolute inset-y-0 left-1/2 flex items-center z-0"
            style={{ 
              animation: 'drift 180s linear infinite',
              transform: `translateX(calc(-50vw + 250px - ${PlaceHolderImages.length * 200}px + 550px))`
            }}
          >
            {fieldBoards.map((img) => (
              <div 
                key={img.id} 
                className="relative shrink-0 overflow-hidden rounded-md shadow-2xl mx-12"
                style={{
                  width: `${img.width}px`, 
                  height: `${img.height}px`, 
                  marginTop: `${img.top}px`, 
                  marginLeft: `${img.left}px`, 
                  opacity: img.opacity, 
                  transform: `scale(${img.scale}) rotate(${img.rotation}deg)`, 
                  filter: `blur(${img.blur}px) grayscale(0.5)`
                }}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] mix-blend-multiply rounded-md" />
              </div>
            ))}
          </div>
        )}
      </div>

      {isNotebookDrawing && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-1000">
           <MotionCanvas
              appState={AppState.DRAWING}
              intensity={intensity}
              onDrawStart={() => {}}
              onPause={() => {}}
              onReleaseComplete={() => {}}
            />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-primary/20 tracking-[1em] uppercase text-xs pointer-events-none">
              Express the thought
            </div>
        </div>
      )}
      
      {showUI && appState === AppState.CHOICE && (
        <ChoiceOverlay onChoice={handleChoice} onHover={setChoiceHover} />
      )}

      {isNotebookActive && (
        <NotebookEntry 
          message={notebookMessage} 
          isGenerating={aiGenerating} 
          onUserReply={handleUserReply}
          onStartDrawing={handleStartDrawing}
          round={round}
        />
      )}

      {appState === AppState.LIFE_FREQUENCY && (
        <LifeFrequency onComplete={handleLifeFrequencyComplete} />
      )}

      {appState === AppState.MAZE_CHALLENGE && (
        <MazeChallenge onComplete={handleMazeComplete} />
      )}

      {appState === AppState.INTEREST_SELECTION && (
        <InterestSelection onSelect={handleInterestSelect} />
      )}

      {appState === AppState.INSTAGRAM_PROMPT && (
        <InstagramPrompt onComplete={handleInstagramComplete} />
      )}

      {appState === AppState.EMAIL_CAPTURE && (
        <EmailCapture onComplete={handleEmailComplete} />
      )}

      {appState === AppState.CODE_VERIFICATION && (
        <CodeVerification email={userEmail} onComplete={handleCodeVerified} />
      )}

      {appState === AppState.VALUATION && (
        <ValuationGame onComplete={handleValuationComplete} />
      )}

      {appState === AppState.MEMORY_GAME && (
        <MemoryGame onComplete={handleMemoryComplete} />
      )}

      {appState === AppState.SECOND_CHANCE && (
        <SecondChance onReset={handleReset} />
      )}

      <style jsx>{`
        @keyframes shadowMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes drift {
          0% {
            transform: translateX(calc(-50vw + 250px - ${PlaceHolderImages.length * 200}px + 550px));
          }
          100% {
            transform: translateX(calc(-50vw + 250px - ${PlaceHolderImages.length * 200}px + 550px + ${PlaceHolderImages.length * 564}px));
          }
        }
      `}</style>
    </main>
  );
}
