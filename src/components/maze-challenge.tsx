"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const MazeChallenge = ({ onComplete }: { onComplete: () => void }) => {
  const [room, setRoom] = useState(1);
  const rooms = [
    { id: 1, text: "The first room is silent. There is no door, only a direction.", action: "Choose a path" },
    { id: 2, text: "The walls are moving at your frequency. You feel the weight of your intent.", action: "Push through" },
    { id: 3, text: "A light appears where there was none. It matches your pulse.", action: "Step into it" }
  ];

  const nextRoom = () => {
    if (room < rooms.length) {
      setRoom(room + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-6 md:p-8 overflow-hidden touch-none">
      <div className="max-w-md w-full space-y-12 md:space-y-16 text-center animate-in fade-in zoom-in duration-1000">
        <div className="space-y-4">
           <p className="text-primary/20 tracking-[1em] uppercase text-[8px] md:text-[10px]">Maze Node {room}/3</p>
           <p className="text-primary text-xl md:text-2xl font-light italic leading-relaxed px-4">
             {rooms[room-1].text}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {['Left', 'Right', 'Forward', 'Backward'].map((dir) => (
            <button
              key={dir}
              onClick={nextRoom}
              className="p-6 md:p-8 border border-primary/5 hover:border-primary/20 active:bg-primary/10 text-primary/40 hover:text-primary transition-all uppercase tracking-widest text-xs min-h-[80px] md:min-h-[100px] flex items-center justify-center touch-manipulation"
            >
              {dir}
            </button>
          ))}
        </div>
      </div>
      
      {/* Decorative Maze Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
         <div className="absolute top-0 left-1/2 w-px h-full bg-primary" />
         <div className="absolute top-1/2 left-0 w-full h-px bg-primary" />
      </div>
    </div>
  );
};

export default MazeChallenge;
