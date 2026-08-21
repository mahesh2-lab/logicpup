import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { CurriculumLevel } from '../../types/landing';

interface CurriculumProgressionProps {
  onSelectLevel?: (levelNumber: number) => void;
  onStartLearning: () => void;
}

export const CurriculumProgression: React.FC<CurriculumProgressionProps> = ({
  onSelectLevel,
  onStartLearning,
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  const curriculumLevels: CurriculumLevel[] = [
    {
      levelNumber: 1,
      title: 'Python Variables, Input & Output',
      description:
        'Learn how Python variables store numbers and strings, prompt for user input with input(), and print results to the terminal.',
      locked: false,
      completed: true,
      challengesCount: 4,
      xpReward: 100,
      skillsCovered: ['Variable assignment', 'input() conversion', 'print() output'],
      tag: 'PYTHON_BASICS',
    },
    {
      levelNumber: 2,
      title: 'Conditionals & If / Else Branching',
      description:
        'Construct decision flowcharts using comparison operators (==, !=, >, <), truth tables, and Python if / elif / else blocks.',
      locked: false,
      completed: false,
      challengesCount: 5,
      xpReward: 150,
      skillsCovered: ['if / else branches', 'Comparison operators', 'Boolean logic'],
      tag: 'DECISION_FLOW',
    },
    {
      levelNumber: 3,
      title: 'While Loops & Game State Cycles',
      description:
        'Build repeating game loops (like the Number Guessing Game), loop break conditions, iteration counters, and retry paths.',
      locked: true,
      completed: false,
      challengesCount: 5,
      xpReward: 250,
      skillsCovered: ['while condition:', 'break & continue', 'Iteration counters'],
      tag: 'WHILE_LOOPS',
    },
    {
      levelNumber: 4,
      title: 'For Loops, Ranges & Lists',
      description:
        'Iterate over Python lists, compute running sums, find maximum values, and manipulate sequences visually.',
      locked: true,
      completed: false,
      challengesCount: 6,
      xpReward: 300,
      skillsCovered: ['for item in list:', 'range(start, stop)', 'Accumulator patterns'],
      tag: 'COLLECTIONS',
    },
    {
      levelNumber: 5,
      title: 'Functions, Parameters & Return Values',
      description:
        'Encapsulate reusable logic into def my_func(a, b): blocks, return values, and understand local vs global variable scopes.',
      locked: true,
      completed: false,
      challengesCount: 5,
      xpReward: 400,
      skillsCovered: ['def function():', 'Arguments & Returns', 'Variable scope'],
      tag: 'FUNCTIONS',
    },
    {
      levelNumber: 6,
      title: 'Data Structures: Dictionaries & Sets',
      description:
        'Model real-world entities with key-value pairs in Python dicts, handle lookups, and validate data integrity.',
      locked: true,
      completed: false,
      challengesCount: 4,
      xpReward: 450,
      skillsCovered: ['Dictionaries', 'Key lookups', 'Set operations'],
      tag: 'DATA_STRUCTURES',
    },
    {
      levelNumber: 7,
      title: 'Classic Algorithms: Sorting & Search',
      description:
        'Visualize Linear Search, Binary Search, and Bubble Sort step-by-step with synchronized memory arrays.',
      locked: true,
      completed: false,
      challengesCount: 5,
      xpReward: 500,
      skillsCovered: ['Binary search', 'Sorting algorithms', 'Time complexity'],
      tag: 'ALGORITHMS',
    },
    {
      levelNumber: 8,
      title: 'Capstone: Text Adventure & Logic Simulator',
      description:
        'Create a full multi-branch Python game or calculator application connecting inputs, functions, state tables, and tests.',
      locked: true,
      completed: false,
      challengesCount: 7,
      xpReward: 1000,
      skillsCovered: ['Full Python program', 'Flowchart synthesis', 'Automated test suite'],
      tag: 'CAPSTONE_PYTHON',
    },
  ];

  const activeLevel =
    curriculumLevels.find((l) => l.levelNumber === selectedLevelId) ||
    curriculumLevels[0];

  return (
    <section
      id="curriculum"
      className="py-16 md:py-24 border-b border-black/[0.06] bg-white/40 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border border-black/[0.06] text-xs font-mono font-semibold text-[#287A52] shadow-xs">
            <span>PYTHON MASTERY PATHWAY 🐾</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121212] tracking-tight">
            8-Level Python Coding Curriculum
          </h2>
          <p className="text-base sm:text-lg text-[#666666]">
            From your very first variable to full game loops: master Python step-by-step with interactive flowcharts and automated test assertions. Treat yourself to real coding skills!
          </p>
        </div>

        {/* 2-Column Layout: Level Grid + Selected Level Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 cols: 8 Levels Interactive List */}
          <div className="lg:col-span-7 space-y-2.5">
            {curriculumLevels.map((lvl) => {
              const isSelected = selectedLevelId === lvl.levelNumber;

              return (
                <div
                  key={lvl.levelNumber}
                  onClick={() => setSelectedLevelId(lvl.levelNumber)}
                  className={`p-4 rounded-sm border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                    isSelected
                      ? 'bg-white border-[#121212] shadow-md ring-2 ring-black/[0.04]'
                      : lvl.locked
                      ? 'bg-white/50 border-black/[0.04] opacity-75 hover:bg-white hover:border-black/10'
                      : 'bg-white border-black/[0.06] hover:border-black/20 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {lvl.completed ? (
                        <div className="w-8 h-8 rounded-sm bg-[#287A52]/15 text-[#287A52] flex items-center justify-center">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </div>
                      ) : lvl.locked ? (
                        <div className="w-8 h-8 rounded-sm bg-black/[0.05] text-[#806A55] flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-sm bg-[#F26A3D]/15 text-[#F26A3D] flex items-center justify-center">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#806A55]">
                          LEVEL 0{lvl.levelNumber}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-black/[0.04] text-[#666666]">
                          {lvl.tag}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#121212] leading-snug">
                        {lvl.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span className="text-xs font-mono font-semibold text-[#888888] hidden sm:inline">
                      +{lvl.xpReward} XP
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#888888]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 5 cols: Active Level Inspection Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="rounded-sm border border-black/[0.08] bg-white p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              
              {/* Header with Level Pill */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-sm bg-[#F26A3D]/10 text-[#F26A3D]">
                  LEVEL 0{activeLevel.levelNumber} • {activeLevel.tag}
                </span>

                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-sm ${
                    activeLevel.completed
                      ? 'bg-[#287A52]/10 text-[#287A52]'
                      : activeLevel.locked
                      ? 'bg-black/[0.05] text-[#806A55]'
                      : 'bg-[#F26A3D] text-white'
                  }`}
                >
                  {activeLevel.completed
                    ? 'COMPLETED'
                    : activeLevel.locked
                    ? 'LOCKED GATE'
                    : 'UNLOCKED'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#121212] tracking-tight">
                  {activeLevel.title}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {activeLevel.description}
                </p>
              </div>

              {/* Skills Taught */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#806A55] uppercase">
                  Python Concepts Mastered:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeLevel.skillsCovered.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-2.5 py-1 rounded-sm bg-[#F8F6F0] border border-black/[0.06] text-[#121212]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenge Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-sm bg-[#F8F6F0] border border-black/[0.04]">
                  <div className="text-[10px] font-mono text-[#888888] uppercase">Interactive Challenges</div>
                  <div className="text-base font-bold text-[#121212]">{activeLevel.challengesCount} Python Specs</div>
                </div>
                <div className="p-3 rounded-sm bg-[#F8F6F0] border border-black/[0.04]">
                  <div className="text-[10px] font-mono text-[#888888] uppercase">Experience XP</div>
                  <div className="text-base font-bold text-[#287A52]">+{activeLevel.xpReward} XP Points</div>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                {activeLevel.locked ? (
                  <div className="p-3 rounded-sm bg-black/[0.04] text-xs text-[#806A55] flex items-center gap-2 font-mono">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span>Complete Level 0{activeLevel.levelNumber - 1} challenges to unlock this gate.</span>
                  </div>
                ) : (
                  <a
                    href="/login?mode=signup"
                    className="w-full py-3 px-4 rounded-sm bg-[#F26A3D] hover:bg-[#D9552A] active:scale-98 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {activeLevel.completed ? 'Replay Python Exercises' : 'Start Level 0' + activeLevel.levelNumber}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
