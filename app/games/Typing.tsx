"use client";

import { useState, useEffect, useRef } from "react";
import { useEPStore } from "@/lib/ep-store";
import { Button } from "@/components/ui/button";
import { RotateCcw, Code, Zap, Crosshair, Timer } from "lucide-react";

const SNIPPETS = [
`function sayHello(name) {
  console.log("Hello " + name);
}`,

`let score = 0;
score = score + 10;
console.log("New score: " + score);`,

`const player = {
  health: 100,
  speed: 5
};
player.health -= 20;`,

`if (password === "secret") {
  unlockDoor();
} else {
  soundAlarm();
}`,

`function jump() {
  if (isGrounded) {
    velocity.y = 10;
    playJumpSound();
  }
}`
];

const normalizeSnippet = (snippet: string) => snippet.trim().replace(/\r\n/g, '\n');

export default function TypingGame() {
  const { addEP } = useEPStore();
  const [target, setTarget] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [finalStats, setFinalStats] = useState({ wpm: 0, accuracy: 0, xp: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [liveWpm, setLiveWpm] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isFinished) {
      interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 60000;
        const words = input.length / 5;
        setLiveWpm(Math.round(words / (timeElapsed || 0.01)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, input, isFinished]);

  const startNewGame = () => {
    setTarget(normalizeSnippet(SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]));
    setInput("");
    setStartTime(null);
    setErrors(0);
    setIsFinished(false);
    setLiveWpm(0);
    setTimeout(() => {
      inputRef.current?.focus();
      setIsFocused(true);
    }, 10);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    
    // Normalize newlines from the textarea
    const val = e.target.value.replace(/\r\n/g, '\n');
    
    if (!startTime && val.length > 0) setStartTime(Date.now());
    
    // Check for new errors
    if (val.length > input.length) { 
      const lastCharIndex = val.length - 1;
      if (val[lastCharIndex] !== target[lastCharIndex]) {
        setErrors(prev => prev + 1);
      }
    }
    
    setInput(val);

    if (val === target) {
      finishGame(val);
    } else if (val.length >= target.length) {
      setInput(val.slice(0, target.length));
      if (val.slice(0, target.length) === target) {
         finishGame(target);
      }
    }
  };
  
  const finishGame = (finalInput: string) => {
      setIsFinished(true);
      const timeElapsed = (Date.now() - (startTime || Date.now())) / 60000;
      const words = target.length / 5;
      const speed = Math.round(words / (timeElapsed || 0.01));
      
      const accuracy = Math.max(0, Math.round(((target.length - errors) / target.length) * 100));
      
      let xp = 0;
      if (accuracy >= 80) {
        xp += 5; // Base completion
        if (speed >= 30) xp += 5;
        if (speed >= 60) xp += 10;
        if (accuracy >= 98) xp += 5;
      }
      
      setFinalStats({ wpm: speed, accuracy, xp });
      if (xp > 0) {
        addEP(xp);
      }
  };

  const renderCharacters = () => {
    return target.split('').map((char, i) => {
      let statusClass = "text-[#A1A1AA]"; // untyped
      let bgClass = "";
      
      if (i < input.length) {
        if (input[i] === char) {
          statusClass = "text-[#171717] font-semibold"; // correct
        } else {
          statusClass = "text-[#EF4444]"; // error
          bgClass = "bg-[#EF4444]/20";
          if (char === ' ' || char === '\n') {
            bgClass = "bg-[#EF4444]/40";
          }
        }
      } else if (i === input.length && !isFinished) {
        // Cursor
        bgClass = "bg-[#F26A3D] animate-pulse";
        statusClass = "text-white";
      }
      
      return (
        <span key={i} className={`${statusClass} ${bgClass} rounded-[2px] transition-colors duration-75`}>
          {char}
        </span>
      );
    });
  };

  const accuracy = input.length > 0 ? Math.max(0, Math.round(((input.length - errors) / input.length) * 100)) : 100;
  const progress = target.length > 0 ? Math.round((input.length / target.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 w-full text-[#171717] animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#D8D4CC] p-4 rounded-[3px] shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#F26A3D] tracking-wider uppercase mb-1 block">CODE TYPER / WORLD 03</span>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight m-0">Speed Coder</h1>
        </div>
        
        <div className="flex gap-3 h-12">
          <div className="bg-[#FAF9F5] border border-[#E5E2DA] px-4 rounded-[3px] flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-[9px] font-bold text-[#888] tracking-wider uppercase flex items-center gap-1"><Timer size={10}/> WPM</span>
            <span className="text-base font-mono font-bold leading-none text-[#F26A3D]">{liveWpm}</span>
          </div>
          <div className="bg-[#FAF9F5] border border-[#E5E2DA] px-4 rounded-[3px] flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-[9px] font-bold text-[#888] tracking-wider uppercase flex items-center gap-1"><Crosshair size={10}/> ACC</span>
            <span className={`text-base font-mono font-bold leading-none ${accuracy < 90 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>{accuracy}%</span>
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

      <section className="bg-white border border-[#D8D4CC] p-4 rounded-[3px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-[#F26A3D] transition-all duration-300" style={{ width: `${progress}%`, zIndex: 10 }} />
        
        <div 
          className="bg-[#FAF9F5] p-6 sm:p-8 rounded-[3px] border border-[#E5E2DA] shadow-inner cursor-text relative group mt-2 overflow-hidden"
          onClick={handleContainerClick}
        >
          <div className="flex items-center gap-2 mb-6 opacity-60">
            <Code size={14} className="text-[#888]" />
            <span className="text-xs font-mono text-[#888] font-bold">code_editor.js</span>
          </div>

          <div className="font-mono text-[16px] sm:text-[18px] leading-relaxed whitespace-pre-wrap select-none break-all relative z-10">
            {renderCharacters()}
          </div>
          
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute top-0 left-0 w-full h-full opacity-0 -z-10 cursor-default resize-none"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
          
          {!isFocused && !isFinished && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20 transition-all rounded-[3px]">
               <span className="text-[#171717] font-bold font-mono bg-white px-4 py-2 rounded-[3px] border border-[#D8D4CC] shadow-sm animate-pulse">
                 Click here to resume coding
               </span>
            </div>
          )}
        </div>
      </section>

      {isFinished && (
        <div className={`p-6 border-2 rounded-[3px] flex flex-col sm:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4 duration-500 shadow-sm ${finalStats.xp > 0 ? 'bg-[#10B981]/10 border-[#10B981]' : 'bg-[#EF4444]/10 border-[#EF4444]'}`}>
          <div className="flex items-center gap-4">
            <div className={`text-white p-3 rounded-full ${finalStats.xp > 0 ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}>
              {finalStats.xp > 0 ? <Zap size={32} /> : <Crosshair size={32} />}
            </div>
            <div>
              <b className={`block text-xl uppercase tracking-tight ${finalStats.xp > 0 ? 'text-[#047857]' : 'text-[#B91C1C]'}`}>
                {finalStats.xp > 0 ? 'Level Complete!' : 'Failed!'}
              </b>
              <p className={`font-medium text-sm mt-1 ${finalStats.xp > 0 ? 'text-[#065F46]' : 'text-[#991B1B]'}`}>
                Speed: <strong>{finalStats.wpm} WPM</strong> | Accuracy: <strong>{finalStats.accuracy}%</strong>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {finalStats.xp > 0 ? (
              <span className="flex items-center font-bold text-sm text-[#047857] bg-white/50 px-3 py-1.5 rounded-[3px] border border-[#10B981]/30">
                +{finalStats.xp} XP <Zap size={14} className="ml-1" fill="currentColor" />
              </span>
            ) : (
              <span className="flex items-center font-bold text-sm text-[#B91C1C] bg-white/50 px-3 py-1.5 rounded-[3px] border border-[#EF4444]/30">
                0 XP
              </span>
            )}
            <Button 
              onClick={startNewGame}
              className="bg-[#171717] hover:bg-[#F26A3D] text-white font-bold uppercase tracking-wider px-8 h-12 rounded-[3px] w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
