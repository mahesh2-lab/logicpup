import React, { useState } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Lock,
  Sliders,
  PlayCircle,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  FolderKanban,
  Sparkles,
  Code2,
} from 'lucide-react';
import { FeatureItem } from '../../types/landing';

interface FeaturesSectionProps {
  onOpenIdePreferences: () => void;
  onStartLearning: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onOpenIdePreferences,
  onStartLearning,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string>('node-editor');
  const [demoAutoSave, setDemoAutoSave] = useState<boolean>(true);
  const [demoFormatOnSave, setDemoFormatOnSave] = useState<boolean>(true);
  const [demoTheme, setDemoTheme] = useState<'paper' | 'slate'>('paper');

  const features: FeatureItem[] = [
    {
      id: 'node-editor',
      title: 'Visual Python Flowchart Editor',
      tagline: 'Connect Blocks -> LogicPup Fetches Executable Python 3',
      description:
        'Construct conditional branching, input prompts, loops, and variable assignments with intuitive 4-port visual blocks. No syntax bite marks, zero tangled leashes.',
      iconName: 'Boxes',
      accentColor: '#F26A3D',
      tag: 'Core Flow Engine',
      capabilities: [
        'Clean 4-directional snap handles (Top, Bottom, Left, Right) on every block',
        'Direct 1:1 synchronization with Python 3.12 syntax',
        'Interactive Step-by-Step AST runtime simulation (watch your logic trot in real-time)',
        'Live Variable Watch Scope (sniff out bugs before they run away)',
      ],
      mockVisualType: 'node-editor',
    },
    {
      id: 'curriculum',
      title: 'Structured 8-Level Python Track',
      tagline: 'From Puppy Steps to Alpha Python Developer',
      description:
        'Master Python systematically through gamified flow challenges: Start with Variables and Input/Output, master If/Else decision branches, build loops, and conquer search algorithms.',
      iconName: 'Lock',
      accentColor: '#287A52',
      tag: 'Python Curriculum',
      capabilities: [
        'Locked-level progression (fetch passing test suites to advance)',
        'Classic algorithmic problems (Number Guessing Game, Even/Odd, Factorial)',
        'Earn XP, unlock certificates, and track mastery badges',
        'Visual execution highlights explaining exactly where conditions branch',
      ],
      mockVisualType: 'curriculum',
    },
    {
      id: 'ide-experience',
      title: 'In-Browser Python IDE Sandbox',
      tagline: 'Instant Code Generation & Local-First Persistence',
      description:
        'Switch instantly between the Visual Flowchart, Generated Python 3 Code tab, and the Interactive REPL Terminal. Everything auto-saves in your browser — no projects buried in the backyard.',
      iconName: 'Sliders',
      accentColor: '#356A9A',
      tag: 'Developer UX',
      capabilities: [
        'Instant 1-click Python script copy and export (.py)',
        'Auto-save of node positions, cables, and variable definitions',
        'Interactive REPL console with stdout, stdin, and step logs',
        '100% client-side sandbox execution with zero setup required',
      ],
      mockVisualType: 'ide-settings',
    },
    {
      id: 'project-management',
      title: 'Python Script & Challenge Manager',
      tagline: 'Multi-Project Flowchart Workspaces',
      description:
        'Organize distinct Python algorithms (Guessing Game, FizzBuzz, Grade Calculator), save revisions, and inspect complete execution histories without losing a single line of logic.',
      iconName: 'PlayCircle',
      accentColor: '#806A55',
      tag: 'Workspaces',
      capabilities: [
        'Switch between multiple isolated flowchart project files',
        'Execute test runs with step-by-step memory inspections',
        'Export flowchart JSON diagrams and clean Python scripts',
        'Full test suite assertion logs and execution traces',
      ],
      mockVisualType: 'run-terminal',
    },
    {
      id: 'user-hub',
      title: 'Student Profile & Achievements',
      tagline: 'Custom Avatars, Treat Badges & Python Certificates',
      description:
        'Track your Python learning streak, cumulative XP earned from solved logic puzzles, and generate downloadable completion certificates to show off to the pack.',
      iconName: 'UserCheck',
      accentColor: '#F26A3D',
      tag: 'Student Hub',
      capabilities: [
        'Student profile with cumulative Python XP and challenge metrics',
        'Custom vector avatar generator',
        'Python mastery certificates upon completing curriculum levels',
        'Persistent offline progression store',
      ],
      mockVisualType: 'user-hub',
    },
  ];

  const current = features.find((f) => f.id === selectedFeature) || features[0];

  return (
    <section
      id="features"
      className="py-16 md:py-24 border-b border-black/6 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The big title introducing all our cool features */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border border-black/6 text-xs font-mono font-semibold text-[#121212] shadow-xs">
            <span>LEASH-FREE VISUAL LEARNING 🐾</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121212] tracking-tight">
            5 Pillars of the LogicPup Python Platform
          </h2>
          <p className="text-base sm:text-lg text-[#666666]">
            Bridge the gap between mental logic flowcharts and real executable Python 3 code — no syntax bites attached.
          </p>
        </div>

        {/* The row of buttons to click through the different features */}
        <div className="relative mb-10 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-16 bg-linear-to-r from-(--theme-bg) to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-linear-to-l from-(--theme-bg) to-transparent z-10" />
          <div className="flex items-center justify-start xl:justify-center gap-1.5 overflow-x-auto pb-4 scrollbar-none px-4 sm:px-6 lg:px-8 before:content-[''] before:w-8 before:shrink-0 after:content-[''] after:w-8 after:shrink-0">
            {features.map((feat) => {
            const isSelected = selectedFeature === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setSelectedFeature(feat.id)}
                className={`px-4 py-2.5 rounded-sm font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#121212] text-white shadow-xs'
                    : 'bg-white text-[#666666] border border-black/6 hover:text-[#121212] hover:bg-[#F8F6F0]'
                }`}
              >
                {feat.id === 'node-editor' && <Boxes className="w-3.5 h-3.5 text-[#F26A3D]" />}
                {feat.id === 'curriculum' && <Lock className="w-3.5 h-3.5 text-[#287A52]" />}
                {feat.id === 'ide-experience' && <Sliders className="w-3.5 h-3.5 text-[#356A9A]" />}
                {feat.id === 'project-management' && <FolderKanban className="w-3.5 h-3.5 text-[#806A55]" />}
                {feat.id === 'user-hub' && <UserCheck className="w-3.5 h-3.5 text-[#F26A3D]" />}
                <span>{feat.title}</span>
              </button>
            );
          })}
        </div>
        </div>

        {/* This box changes depending on which feature tab you clicked */}
        <div className="rounded-sm border border-black/8 bg-white p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left side: The text explaining why this feature is awesome */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span
                  className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-sm text-white inline-block"
                  style={{ backgroundColor: current.accentColor }}
                >
                  {current.tag.toUpperCase()}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121212] tracking-tight">
                  {current.title}
                </h3>
                <p className="text-xs font-mono text-[#806A55] font-semibold">
                  {current.tagline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                {current.description}
              </p>

              {/* A quick rundown of what you get */}
              <div className="space-y-2.5 pt-1">
                {current.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[#121212]">
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: current.accentColor }}
                    />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                onClick={() => { window.location.href = "/login?mode=signup"; }}
                className="px-5 py-2.5 rounded-sm bg-[#F26A3D] hover:bg-[#D9552A] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore {current.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right side: A fun little interactive preview of the feature */}
            <div className="lg:col-span-6">
              <div className="rounded-sm border border-black/[0.06] bg-[#F8F6F0] p-5 space-y-4">
                
                {/* Preview 1: Our drag-and-drop flowchart builder */}
                {current.id === 'node-editor' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2 text-xs font-mono text-[#666666]">
                      <span>PYTHON FLOW: Number Guessing Game</span>
                      <span className="text-[#287A52] font-semibold">● 7 Blocks Synchronized</span>
                    </div>
                    <div className="space-y-2.5 bg-white p-4 rounded-sm border border-black/[0.06]">
                      {/* The green block where it all begins */}
                      <div className="p-2.5 bg-white rounded-sm border border-[#171717] border-l-4 border-l-[#171717] flex items-center justify-between shadow-xs">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#171717]">START</span>
                          <div className="text-[11px] text-[#555555]">Program begins here</div>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-black/5 text-[#171717]">Entry</span>
                      </div>

                      {/* A regular block doing some math or logic */}
                      <div className="p-2.5 bg-white rounded-sm border border-[#171717] flex items-center justify-between shadow-xs">
                        <div>
                          <div className="text-xs font-bold text-[#171717]">Set Secret Number</div>
                          <code className="text-[10px] font-mono text-[#356A9A]">secret_number = 7</code>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#356A9A]/10 text-[#356A9A]">int assign</span>
                      </div>

                      {/* The block that makes a decision (IF/ELSE) */}
                      <div className="p-2.5 bg-white rounded-sm border border-[#171717] flex items-center justify-between shadow-xs">
                        <div>
                          <div className="text-xs font-bold text-[#171717]">Check Match</div>
                          <code className="text-[10px] font-mono text-[#806A55]">if guess == secret_number:</code>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#287A52]/10 text-[#287A52]">branch: True / False</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview 2: The learning path with levels */}
                {current.id === 'curriculum' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2 text-xs font-mono text-[#666666]">
                      <span>PYTHON CURRICULUM PROGRESSION</span>
                      <span className="text-[#F26A3D] font-bold">Level 1 of 8</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-sm bg-white border border-black/[0.06] flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-[#287A52]" />
                          <div>
                            <div className="text-xs font-bold text-[#121212]">Level 1: Variables & User Input</div>
                            <div className="text-[10px] font-mono text-[#888888]">4/4 Challenges Passed</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#287A52] bg-[#287A52]/10 px-2 py-0.5 rounded-sm">UNLOCKED</span>
                      </div>

                      <div className="p-3 rounded-sm bg-white border border-[#F26A3D] flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-[#F26A3D]" />
                          <div>
                            <div className="text-xs font-bold text-[#121212]">Level 2: Conditionals & If / Else</div>
                            <div className="text-[10px] font-mono text-[#F26A3D] font-semibold">Active in Progress</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-white bg-[#F26A3D] px-2 py-0.5 rounded-sm">IN PROGRESS</span>
                      </div>

                      <div className="p-3 rounded-sm bg-white/60 border border-black/[0.04] flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-5 h-5 text-[#806A55]" />
                          <div>
                            <div className="text-xs font-bold text-[#666666]">Level 3: While Loops & State Cycles</div>
                            <div className="text-[10px] font-mono text-[#888888]">Requires Level 2 Completion</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-[#806A55] bg-black/[0.04] px-2 py-0.5 rounded-sm">LOCKED</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview 3: The slick coding environment */}
                {current.id === 'ide-experience' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2 text-xs font-mono text-[#666666]">
                      <span>PYTHON SANDBOX PREFERENCES</span>
                      <span className="text-[#356A9A] font-semibold">Local-First</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      {/* A fake switch to toggle saving */}
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-sm border border-black/[0.06]">
                        <div>
                          <div className="font-bold text-[#121212]">Auto-Save to LocalStorage</div>
                          <div className="text-[10px] text-[#666666]">Persists flow & Python code on every connection</div>
                        </div>
                        <button
                          onClick={() => setDemoAutoSave(!demoAutoSave)}
                          className={`w-9 h-5 rounded-sm transition-colors relative cursor-pointer ${
                            demoAutoSave ? 'bg-[#287A52]' : 'bg-black/15'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-sm bg-white transition-transform absolute top-0.5 ${
                              demoAutoSave ? 'left-4.5' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* A fake switch to format code */}
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-sm border border-black/[0.06]">
                        <div>
                          <div className="font-bold text-[#121212]">Format Python Code</div>
                          <div className="text-[10px] text-[#666666]">PEP 8 compliant formatting</div>
                        </div>
                        <button
                          onClick={() => setDemoFormatOnSave(!demoFormatOnSave)}
                          className={`w-9 h-5 rounded-sm transition-colors relative cursor-pointer ${
                            demoFormatOnSave ? 'bg-[#287A52]' : 'bg-black/15'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-sm bg-white transition-transform absolute top-0.5 ${
                              demoFormatOnSave ? 'left-4.5' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview 4: How projects are organized */}
                {current.id === 'project-management' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2 text-xs font-mono text-[#666666]">
                      <span>PYTHON REPOSITORIES: 3 FILES</span>
                      <span className="text-[#806A55] font-semibold">Python 3.12</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-sm bg-white border border-black/[0.06] flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-[#287A52]" />
                          <span className="font-bold text-[#121212]">guess_game.py</span>
                        </div>
                        <span className="text-[#287A52] font-mono font-semibold">Victory (7 blocks)</span>
                      </div>
                      <div className="p-2.5 rounded-sm bg-white border border-black/[0.06] flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-[#287A52]" />
                          <span className="font-bold text-[#121212]">even_odd_checker.py</span>
                        </div>
                        <span className="text-[#287A52] font-mono font-semibold">Verified</span>
                      </div>
                      <div className="p-2.5 rounded-sm bg-white border border-black/[0.06] flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-[#356A9A]" />
                          <span className="font-bold text-[#121212]">fizzbuzz_loop.py</span>
                        </div>
                        <span className="text-[#356A9A] font-mono font-semibold">Passed 100/100</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview 5: Where the user hangs out */}
                {current.id === 'user-hub' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2 text-xs font-mono text-[#666666]">
                      <span>STUDENT PYTHON PROFILE</span>
                      <span className="text-[#F26A3D] font-bold">Python Scholar</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-sm border border-black/[0.06] shadow-xs">
                      <div className="w-10 h-10 rounded-sm bg-[#F26A3D] text-white flex items-center justify-center font-bold text-sm">
                        PY
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-xs text-[#121212]">Alex Reynolds</h5>
                        <p className="text-[11px] font-mono text-[#666666]">alex@python.edu • 1,450 XP</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-sm bg-[#287A52]/10 text-[#287A52] text-[10px] font-mono font-bold">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 bg-white rounded-sm border border-black/[0.06]">
                        <div className="text-[#888888] text-[9px]">FLOWCHARTS WIRED</div>
                        <div className="font-bold text-[#121212] text-sm">18 Programs</div>
                      </div>
                      <div className="p-2.5 bg-white rounded-sm border border-black/[0.06]">
                        <div className="text-[#888888] text-[9px]">PYTHON RUNS EXECUTED</div>
                        <div className="font-bold text-[#121212] text-sm">340 Runs</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
