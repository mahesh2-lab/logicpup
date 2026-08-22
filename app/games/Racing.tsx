"use client";

import { useEffect, useMemo, useState } from "react";
import { useEPStore } from "@/lib/ep-store";
import {
  Check,
  ChevronDown,
  Flag,
  Play,
  RotateCcw,
  Trash2,
  Trophy,
  Ghost,
  MapPin,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

type CommandType = "MOVE" | "LEFT" | "RIGHT" | "JUMP";
type Command = { type: CommandType };
type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";

interface PlayerState {
  x: number;
  y: number;
  direction: Direction;
  isDead: boolean;
  won: boolean;
}

type Level = {
  id: number;
  name: string;
  concept: string;
  mission: string;
  available: CommandType[];
  route: { x: number; y: number }[];
  coins: { x: number; y: number }[];
  obstacles: { x: number; y: number }[];
};

const levels: Level[] = [
  {
    id: 1,
    name: "First Drive",
    concept: "Sequencing",
    mission: "Reach the finish line.",
    available: ["MOVE", "LEFT", "RIGHT"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
    ],
    coins: [{ x: 3, y: 4 }],
    obstacles: [],
  },
  {
    id: 2,
    name: "Corner",
    concept: "Turns",
    mission: "Navigate the corner to the finish.",
    available: ["MOVE", "LEFT", "RIGHT"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
    ],
    coins: [{ x: 3, y: 3 }],
    obstacles: [],
  },
  {
    id: 3,
    name: "Dot Collector",
    concept: "Planning",
    mission: "Collect 3 dots and reach the finish.",
    available: ["MOVE", "LEFT", "RIGHT"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
    ],
    coins: [
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 3 },
    ],
    obstacles: [],
  },
  {
    id: 4,
    name: "Shortcut",
    concept: "Algorithms",
    mission: "Find the shortest route.",
    available: ["MOVE", "LEFT", "RIGHT"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
    ],
    coins: [{ x: 4, y: 4 }],
    obstacles: [{ x: 3, y: 3 }],
  },
  {
    id: 5,
    name: "Repeat!",
    concept: "Loops",
    mission: "Use your code to reach the finish.",
    available: ["MOVE", "LEFT", "RIGHT"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 5, y: 3 },
      { x: 5, y: 2 },
    ],
    coins: [
      { x: 3, y: 4 },
      { x: 5, y: 3 },
    ],
    obstacles: [],
  },
  {
    id: 6,
    name: "Ghost Alley",
    concept: "Conditions",
    mission: "Get around the ghosts without a collision.",
    available: ["MOVE", "LEFT", "RIGHT", "JUMP"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ],
    coins: [{ x: 2, y: 3 }],
    obstacles: [
      { x: 3, y: 4 },
      { x: 3, y: 3 },
    ],
  },
  {
    id: 7,
    name: "Energy Crisis",
    concept: "Variables",
    mission: "Finish using 8 commands or fewer.",
    available: ["MOVE", "LEFT", "RIGHT", "JUMP"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
    ],
    coins: [{ x: 3, y: 4 }],
    obstacles: [],
  },
  {
    id: 8,
    name: "Ghost Trap",
    concept: "Debugging",
    mission: "Fix the route and reach the finish.",
    available: ["MOVE", "LEFT", "RIGHT", "JUMP"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
    ],
    coins: [{ x: 2, y: 3 }],
    obstacles: [{ x: 3, y: 4 }],
  },
  {
    id: 9,
    name: "Rival Coder",
    concept: "Optimization",
    mission: "Beat the optimal route to the finish.",
    available: ["MOVE", "LEFT", "RIGHT", "JUMP"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
    ],
    coins: [{ x: 3, y: 4 }],
    obstacles: [],
  },
  {
    id: 10,
    name: "Pac-Coder Championship",
    concept: "Synthesis",
    mission: "Collect every dot and win the championship.",
    available: ["MOVE", "LEFT", "RIGHT", "JUMP"],
    route: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
    ],
    coins: [
      { x: 2, y: 3 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ],
    obstacles: [
      { x: 3, y: 4 },
      { x: 4, y: 3 },
    ],
  },
];

const labels: Record<CommandType, string> = {
  MOVE: "MOVE",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  JUMP: "JUMP",
};

const icons: Record<CommandType, string> = {
  MOVE: "↑",
  LEFT: "↶",
  RIGHT: "↷",
  JUMP: "↟",
};

function PacmanIcon({ active, direction, isDead }: { active?: boolean, direction: Direction, isDead?: boolean }) {
  const rotation = {
    EAST: 'rotate-0',
    SOUTH: 'rotate-90',
    WEST: 'rotate-180',
    NORTH: '-rotate-90'
  }[direction];

  if (isDead) {
    return (
      <div className="relative flex items-center justify-center">
        <XCircle className="text-[#F26A3D] w-6 h-6 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center transition-transform duration-200 ${rotation} ${active ? 'animate-pulse' : ''}`}>
      <div 
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-10 sm:border-12 border-[#FBBF24]"
        style={{ borderRightColor: 'transparent' }} 
      />
    </div>
  );
}

function generateTimeline(program: Command[], level: Level): PlayerState[] {
  const startPos = level.route[0];
  let current: PlayerState = { x: startPos.x, y: startPos.y, direction: 'EAST', isDead: false, won: false };
  const timeline = [current];

  for (const cmd of program) {
    if (current.isDead || current.won) break;

    const next = { ...current };

    if (cmd.type === 'LEFT') {
      const dirs: Direction[] = ['NORTH', 'WEST', 'SOUTH', 'EAST'];
      next.direction = dirs[(dirs.indexOf(next.direction) + 1) % 4];
    } else if (cmd.type === 'RIGHT') {
      const dirs: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
      next.direction = dirs[(dirs.indexOf(next.direction) + 1) % 4];
    } else if (cmd.type === 'MOVE' || cmd.type === 'JUMP') {
      const dist = cmd.type === 'JUMP' ? 2 : 1;
      if (next.direction === 'NORTH') next.y -= dist;
      if (next.direction === 'SOUTH') next.y += dist;
      if (next.direction === 'EAST') next.x += dist;
      if (next.direction === 'WEST') next.x -= dist;
    }

    if (next.x < 0 || next.x > 6 || next.y < 0 || next.y > 4) {
      next.isDead = true;
    } else if (level.obstacles.some(o => o.x === next.x && o.y === next.y)) {
      next.isDead = true;
    }

    timeline.push(next);
    current = next;
  }

  const lastState = { ...timeline[timeline.length - 1] };
  const finishLine = level.route[level.route.length - 1];
  
  if (!lastState.isDead && lastState.x === finishLine.x && lastState.y === finishLine.y) {
    lastState.won = true;
  } else if (!lastState.won) {
    lastState.isDead = true;
  }
  
  // Replace the last state to ensure we correctly display the win/loss condition
  timeline[timeline.length - 1] = lastState;

  return timeline;
}

export default function RacingGame() {
  const { addEP } = useEPStore();
  const [levelId, setLevelId] = useState(1);
  const [unlocked, setUnlocked] = useState(1);
  const [stars, setStars] = useState(0);
  const [program, setProgram] = useState<Command[]>([
    { type: "MOVE" },
    { type: "MOVE" },
    { type: "MOVE" },
  ]);
  
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'win' | 'lose'>('idle');
  const [timeline, setTimeline] = useState<PlayerState[]>([]);
  
  const level = levels[levelId - 1];
  const routeSet = useMemo(
    () => new Set(level.route.map((p) => `${p.x}-${p.y}`)),
    [level],
  );

  useEffect(() => {
    const saved = localStorage.getItem("paccoder-progress-v1");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setUnlocked(p.unlocked ?? 1);
        setStars(p.stars ?? 0);
      } catch {}
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem(
      "paccoder-progress-v1",
      JSON.stringify({ unlocked, stars }),
    );
  }, [unlocked, stars]);

  const selectLevel = (id: number) => {
    if (id > unlocked) return;
    setLevelId(id);
    setProgram(
      Array.from({ length: Math.min(3 + id, 7) }, () => ({ type: "MOVE" })),
    );
    setActiveStep(0);
    setStatus('idle');
  };

  const run = () => {
    if (status === 'running') return;
    
    const newTimeline = generateTimeline(program, level);
    setTimeline(newTimeline);
    setStatus('running');
    setActiveStep(0);
    
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setActiveStep(i);
      
      if (i >= newTimeline.length - 1) {
        clearInterval(timer);
        const finalState = newTimeline[newTimeline.length - 1];
        if (finalState.won) {
          setStatus('win');
          setStars((s) => Math.min(30, s + 2));
          addEP(3); // Award 3 global XP
          setUnlocked((u) => Math.max(u, Math.min(10, levelId + 1)));
        } else {
          setStatus('lose');
        }
      }
    }, 400);
  };

  const reset = () => {
    setStatus('idle');
    setActiveStep(0);
  };

  const currentState = status === 'idle' 
    ? { x: level.route[0].x, y: level.route[0].y, direction: 'EAST' as Direction, isDead: false, won: false } 
    : (timeline[activeStep] || timeline[timeline.length - 1]);

  return (
    <div className="flex flex-col gap-6 w-full text-[#171717]">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#D8D4CC] p-4 sm:p-6 rounded-[3px] shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#F26A3D] tracking-wider uppercase mb-1 block">PAC-CODER / WORLD 01</span>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight m-0">Code. Eat. Repeat.</h1>
        </div>
        
        <div className="relative">
          <select
            value={levelId}
            onChange={(e) => selectLevel(Number(e.target.value))}
            className="appearance-none bg-[#FAF9F5] border border-[#E5E2DA] hover:border-[#D8D4CC] text-[#171717] text-sm font-bold pl-4 pr-10 py-2.5 rounded-[3px] cursor-pointer outline-none focus:ring-2 focus:ring-[#F26A3D]/20 transition-all"
          >
            {levels.map((item) => (
              <option
                key={item.id}
                value={item.id}
                disabled={item.id > unlocked}
              >
                Level {item.id} · {item.name}
                {item.id > unlocked ? " (Locked)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Track Panel */}
        <div className="lg:col-span-3 bg-white border border-[#D8D4CC] p-6 rounded-[3px] shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-[#888] tracking-wider uppercase mb-1 block">
                TRACK / {level.concept.toUpperCase()}
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight">{level.name}</h2>
            </div>
            <span className={`flex items-center gap-2 text-xs font-bold uppercase px-3 py-1.5 rounded-[3px] bg-[#FAF9F5] border border-[#E5E2DA] ${status === 'running' ? 'text-[#10B981]' : status === 'lose' ? 'text-[#EF4444]' : 'text-[#888]'}`}>
              <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]' : status === 'lose' ? 'bg-[#EF4444]' : 'bg-[#D8D4CC]'}`} /> 
              {status === 'running' ? "RUNNING" : status === 'win' ? "COMPLETE" : status === 'lose' ? "CRASHED" : "READY"}
            </span>
          </div>
          
          <p className="text-[#555] text-sm mb-6">{level.mission}</p>
          
          <div className="grid grid-cols-7 gap-1 bg-[#FAF9F5] p-3 rounded-[3px] mb-6 border border-[#E5E2DA]">
            {Array.from({ length: 35 }).map((_, i) => {
              const x = i % 7, y = Math.floor(i / 7), key = `${x}-${y}`;
              const obstacle = level.obstacles.some((p) => p.x === x && p.y === y);
              const coin = level.coins.some((p) => p.x === x && p.y === y);
              const finish = level.route.at(-1)?.x === x && level.route.at(-1)?.y === y;
              
              const isPacmanHere = currentState.x === x && currentState.y === y;
              
              let cellBg = "bg-white";
              if (obstacle) cellBg = "bg-[#171717]/5 border-transparent";
              else if (isPacmanHere && currentState.isDead) cellBg = "bg-[#EF4444]/10 border-[#EF4444]/30";
              else if (routeSet.has(key)) cellBg = "bg-[#F26A3D]/5 border-[#F26A3D]/10";
              
              if (finish) cellBg = "bg-[#10B981]/10 border-[#10B981]/20";
              
              return (
                <div
                  className={`aspect-square ${cellBg} rounded-[3px] flex items-center justify-center relative border shadow-sm`}
                  key={key}
                >
                  {coin && !isPacmanHere && <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.6)]" />} 
                  {finish && !isPacmanHere && <Flag size={20} className="text-[#10B981]" />} 
                  {obstacle && !isPacmanHere && <Ghost size={24} className="text-[#F26A3D] fill-[#F26A3D]/20" />}
                  {isPacmanHere && <PacmanIcon active={status === 'running'} direction={currentState.direction} isDead={currentState.isDead} />}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs font-bold text-[#888] uppercase mt-auto pt-4 border-t border-[#E5E2DA]">
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" /> {level.coins.length} Dots on track
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> Finish line
            </span>
          </div>
        </div>

        {/* Code Panel */}
        <div className="lg:col-span-2 bg-white border border-[#D8D4CC] p-6 rounded-[3px] shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-bold text-[#888] tracking-wider uppercase mb-1 block">YOUR PROGRAM</span>
              <h2 className="text-xl font-bold uppercase tracking-tight">Build route</h2>
            </div>
            <span className="text-xs font-bold bg-[#FAF9F5] border border-[#E5E2DA] px-2.5 py-1 rounded-[3px] text-[#555]">{program.length} blocks</span>
          </div>
          
          <div className="flex flex-col gap-2 mb-6 h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {program.map((command, index) => {
              const isExecuting = status === 'running' && activeStep - 1 === index;
              
              return (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-[3px] border-2 font-bold text-sm transition-all shadow-sm shrink-0 ${
                    isExecuting 
                      ? "bg-[#171717] text-white border-[#171717] scale-[1.02]" 
                      : "bg-[#FAF9F5] border-[#E5E2DA] text-[#171717]"
                  }`}
                  key={`${index}-${command.type}`}
                >
                  <span className={`font-mono px-2 py-0.5 rounded-[3px] ${isExecuting ? 'bg-white/20' : 'bg-black/5'}`}>
                    {icons[command.type]}
                  </span>
                  <span>{labels[command.type]}</span>
                  <button
                    aria-label={`Remove ${labels[command.type]}`}
                    className={`ml-auto p-1.5 rounded-[3px] hover:bg-black/10 transition-colors ${isExecuting ? 'text-white/70 hover:text-white' : 'text-[#888] hover:text-[#EF4444]'}`}
                    onClick={() => setProgram((p) => p.filter((_, i) => i !== index))}
                    disabled={status === 'running'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="bg-[#FAF9F5] p-3 rounded-[3px] border border-[#E5E2DA] mb-8 flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#888] tracking-wider uppercase mb-4 text-center block w-full">Command Palette</span>
            
            <div className="grid grid-cols-3 gap-1.5 w-fit mx-auto">
              <div />
              {/* UP / MOVE */}
              <button
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-[3px] border-2 font-bold text-[10px] transition-all active:scale-95 ${
                  level.available.includes('MOVE') && status !== 'running'
                    ? 'bg-white border-[#D8D4CC] hover:border-[#F26A3D] hover:text-[#F26A3D] hover:shadow-sm'
                    : 'bg-black/5 border-transparent text-[#888] opacity-50 cursor-not-allowed'
                }`}
                onClick={() => level.available.includes('MOVE') && setProgram((p) => [...p, { type: 'MOVE' }])}
                disabled={!level.available.includes('MOVE') || status === 'running'}
              >
                <span className="font-mono text-lg leading-tight">{icons['MOVE']}</span>
                <span>MOVE</span>
              </button>
              <div />

              {/* LEFT */}
              <button
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-[3px] border-2 font-bold text-[10px] transition-all active:scale-95 ${
                  level.available.includes('LEFT') && status !== 'running'
                    ? 'bg-white border-[#D8D4CC] hover:border-[#F26A3D] hover:text-[#F26A3D] hover:shadow-sm'
                    : 'bg-black/5 border-transparent text-[#888] opacity-50 cursor-not-allowed'
                }`}
                onClick={() => level.available.includes('LEFT') && setProgram((p) => [...p, { type: 'LEFT' }])}
                disabled={!level.available.includes('LEFT') || status === 'running'}
              >
                <span className="font-mono text-lg leading-tight">{icons['LEFT']}</span>
                <span>LEFT</span>
              </button>
              
              {/* CENTER SPACER */}
              <div className="w-14 h-14 rounded-[3px] bg-black/5" />
              
              {/* RIGHT */}
              <button
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-[3px] border-2 font-bold text-[10px] transition-all active:scale-95 ${
                  level.available.includes('RIGHT') && status !== 'running'
                    ? 'bg-white border-[#D8D4CC] hover:border-[#F26A3D] hover:text-[#F26A3D] hover:shadow-sm'
                    : 'bg-black/5 border-transparent text-[#888] opacity-50 cursor-not-allowed'
                }`}
                onClick={() => level.available.includes('RIGHT') && setProgram((p) => [...p, { type: 'RIGHT' }])}
                disabled={!level.available.includes('RIGHT') || status === 'running'}
              >
                <span className="font-mono text-lg leading-tight">{icons['RIGHT']}</span>
                <span>RIGHT</span>
              </button>

              {/* DOWN / JUMP */}
              <div />
              <button
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-[3px] border-2 font-bold text-[10px] transition-all active:scale-95 ${
                  level.available.includes('JUMP') && status !== 'running'
                    ? 'bg-white border-[#D8D4CC] hover:border-[#F26A3D] hover:text-[#F26A3D] hover:shadow-sm'
                    : 'bg-black/5 border-transparent text-[#888] opacity-50 cursor-not-allowed'
                }`}
                onClick={() => level.available.includes('JUMP') && setProgram((p) => [...p, { type: 'JUMP' }])}
                disabled={!level.available.includes('JUMP') || status === 'running'}
              >
                <span className="font-mono text-lg leading-tight">{icons['JUMP']}</span>
                <span>JUMP</span>
              </button>
              <div />
            </div>
          </div>
          
          <div className="flex gap-3 mt-auto">
            <Button 
              className="flex-2 bg-[#171717] hover:bg-[#F26A3D] text-white font-bold uppercase h-14 w-full text-sm rounded-[3px]" 
              onClick={run} 
              disabled={status === 'running'}
            >
              <Play size={16} className="mr-2" fill="currentColor" /> 
              {status === 'running' ? "Running…" : status === 'win' || status === 'lose' ? "Run Again" : "Run Code"}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 font-bold uppercase h-14 text-[#555] border-[#D8D4CC] hover:text-[#171717] text-sm rounded-[3px]" 
              onClick={reset}
              disabled={status === 'running'}
            >
              <RotateCcw size={16} className="mr-2" /> Reset
            </Button>
          </div>
          
          {status === 'win' && (
            <div className="mt-4 p-4 bg-[#10B981]/10 border-2 border-[#10B981] rounded-[3px] flex items-center gap-4 text-[#047857] animate-in slide-in-from-bottom-2 duration-300 shadow-sm">
              <div className="bg-[#10B981] text-white p-2 rounded-full">
                <Trophy size={20} />
              </div>
              <div>
                <b className="block text-sm uppercase tracking-tight">Race complete!</b>
                <span className="text-xs font-bold opacity-80">+2 stars · +3 XP</span>
              </div>
              {levelId < 10 && (
                <button 
                  className="ml-auto flex items-center gap-1 font-bold text-xs uppercase hover:text-[#10B981] transition-colors"
                  onClick={() => selectLevel(levelId + 1)}
                >
                  Next race <ChevronDown size={14} />
                </button>
              )}
            </div>
          )}

          {status === 'lose' && (
            <div className="mt-4 p-4 bg-[#EF4444]/10 border-2 border-[#EF4444] rounded-[3px] flex items-center gap-4 text-[#B91C1C] animate-in shake duration-300 shadow-sm">
              <div className="bg-[#EF4444] text-white p-2 rounded-full">
                <XCircle size={20} />
              </div>
              <div>
                <b className="block text-sm uppercase tracking-tight">Game Over!</b>
                <span className="text-xs font-bold opacity-80">Route incomplete or crashed.</span>
              </div>
              <button 
                className="ml-auto flex items-center gap-1 font-bold text-xs uppercase hover:text-[#EF4444] transition-colors"
                onClick={reset}
              >
                Try Again <RotateCcw size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="flex justify-between items-center text-xs font-bold text-[#888] uppercase pt-4 px-2">
        <span className="flex items-center gap-1.5">
          <Check size={14} /> {unlocked}/10 races unlocked
        </span>
        <span>Pac-Coder V1.5</span>
      </footer>
    </div>
  );
}
