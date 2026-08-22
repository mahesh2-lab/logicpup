"use client";

import { useState, useEffect } from "react";
import { useEPStore } from "@/lib/ep-store";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, Trophy, Zap, 
  Cpu, HardDrive, Laptop, Monitor, Smartphone, Server, Mouse, Keyboard 
} from "lucide-react";

const CARDS = ["cpu", "harddrive", "laptop", "monitor", "smartphone", "server", "mouse", "keyboard"];

const getIcon = (id: string, isMatched: boolean) => {
  const colorClass = isMatched ? "text-[#10B981]" : "text-[#171717]";
  const props = { size: 36, strokeWidth: 1.5, className: colorClass };
  
  switch (id) {
    case "cpu": return <Cpu {...props} />;
    case "harddrive": return <HardDrive {...props} />;
    case "laptop": return <Laptop {...props} />;
    case "monitor": return <Monitor {...props} />;
    case "smartphone": return <Smartphone {...props} />;
    case "server": return <Server {...props} />;
    case "mouse": return <Mouse {...props} />;
    case "keyboard": return <Keyboard {...props} />;
    default: return null;
  }
};

export default function MemoryGame() {
  const { addEP } = useEPStore();
  const [deck, setDeck] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...CARDS, ...CARDS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setFlipped([]);
    setMatched([]);
    setWon(false);
    setMoves(0);
  };

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (deck[newFlipped[0]] === deck[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        if (matched.length + 2 === deck.length) {
          setWon(true);
          addEP(5); // Award 5 XP for winning
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
      
      <div className="flex flex-col gap-4 w-full text-[#171717] animate-in fade-in duration-300 max-w-4xl mx-auto">
        
        {/* Header matching Pac-Coder */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#D8D4CC] p-4 rounded-[3px] shadow-sm">
          <div>
            <span className="text-xs font-bold text-[#F26A3D] tracking-wider uppercase mb-1 block">MEMORY MATCH / WORLD 02</span>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight m-0">Hardware Match</h1>
          </div>
          
          <div className="flex gap-3 h-12">
            <div className="bg-[#FAF9F5] border border-[#E5E2DA] px-4 rounded-[3px] flex flex-col items-center justify-center min-w-20">
              <span className="text-[9px] font-bold text-[#888] tracking-wider uppercase block">Moves</span>
              <span className="text-base font-mono font-bold leading-none">{moves}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={startNewGame}
              className="h-full border-[#D8D4CC] text-[#555] hover:text-[#171717] font-bold uppercase text-xs rounded-[3px]"
            >
              <RotateCcw size={16} className="mr-2" /> Reset
            </Button>
          </div>
        </section>
        
        {/* Game Board */}
        <section className="bg-white border border-[#D8D4CC] p-4 rounded-[3px] shadow-sm">
          <div className="bg-[#FAF9F5] p-4 sm:p-6 rounded-[3px] border border-[#E5E2DA]">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-105 mx-auto">
              {deck.map((card, i) => {
                const isFlipped = flipped.includes(i) || matched.includes(i);
                const isMatched = matched.includes(i);
                
                return (
                  <div
                    key={i}
                    className="aspect-square perspective-1000 cursor-pointer group"
                    onClick={() => handleFlip(i)}
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : 'group-hover:scale-[1.02]'}`}>
                      
                      {/* Back of card */}
                      <div className="absolute w-full h-full backface-hidden bg-[#171717] rounded-[3px] border-b-4 sm:border-b-[6px] border-black shadow-sm flex items-center justify-center">
                        <Cpu size={28} className="text-[#F26A3D] opacity-80" />
                      </div>
                      
                      {/* Front of card */}
                      <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-[3px] flex items-center justify-center shadow-sm border-2 transition-colors ${
                        isMatched 
                          ? "bg-[#10B981]/10 border-[#10B981]" 
                          : "bg-white border-[#D8D4CC]"
                      }`}>
                        {getIcon(card, isMatched)}
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Win Screen */}
        {won && (
          <div className="p-6 bg-[#10B981]/10 border-2 border-[#10B981] rounded-[3px] flex flex-col sm:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4 duration-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-[#10B981] text-white p-3 rounded-full">
                <Trophy size={32} />
              </div>
              <div>
                <b className="block text-xl uppercase tracking-tight text-[#047857]">Level Complete!</b>
                <p className="text-[#065F46] font-medium text-sm mt-1">
                  You completed the match in <strong className="font-bold">{moves} moves</strong>.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <span className="flex items-center font-bold text-sm text-[#047857] bg-white/50 px-3 py-1.5 rounded-[3px] border border-[#10B981]/30">
                +5 XP <Zap size={14} className="ml-1" fill="currentColor" />
              </span>
              <Button 
                onClick={startNewGame}
                className="bg-[#171717] hover:bg-[#F26A3D] text-white font-bold uppercase tracking-wider px-8 h-12 rounded-[3px] w-full sm:w-auto"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
