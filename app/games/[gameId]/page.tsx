"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useEPStore } from "@/lib/ep-store";
import { DashboardShell } from "@/components/visual-editor/dashboard/DashboardShell";
import { ChevronLeft, Zap, Lock, Play, Gamepad2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { GAMES_CATALOG } from "../catalog";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  
  const { ep, unlockedGames, isLoading, loadState } = useEPStore();
  const challengeXP = useProjectsStore((state) => state.getTotalEarnedPoints());
  const totalXP = ep + challengeXP;
  const [mounted, setMounted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const router = useRouter();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowExitConfirm(true);
  };

  useEffect(() => {
    loadState();
    setMounted(true);
  }, [loadState]);

  // Prevent hard refresh or closing tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStarted) {
        e.preventDefault();
        e.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStarted]);

  // Prevent browser back button
  useEffect(() => {
    if (!hasStarted) return;

    // Push a dummy state so the back button has something to pop
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = (e: PopStateEvent) => {
      // Prevent going back
      window.history.pushState(null, '', window.location.href);
      // Show our custom exit confirmation modal
      setShowExitConfirm(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasStarted]);

  if (!mounted || isLoading) {
    return (
      <DashboardShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-[#888] animate-pulse font-mono uppercase text-sm">Loading...</p>
        </div>
      </DashboardShell>
    );
  }

  const game = GAMES_CATALOG.find((g) => g.id === gameId);
  
  if (!game) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Game not found</h1>
          <Link href="/games" className={buttonVariants({ variant: "default" })}>Back to Arcade</Link>
        </div>
      </DashboardShell>
    );
  }

  const isUnlocked = unlockedGames[game.id];

  if (!isUnlocked) {
    return (
      <DashboardShell>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="bg-[#FAF9F5] border border-[#E5E2DA] rounded-xl p-12">
            <Lock className="w-16 h-16 mx-auto mb-4 text-[#888]" />
            <h1 className="text-2xl font-bold mb-2 uppercase tracking-tight text-[#171717]">{game.name} is Locked</h1>
            <p className="text-[#555] mb-8">You need to unlock this game from the Arcade Hub first. It costs {game.cost} XP.</p>
            <Link href="/games" className={buttonVariants({ className: "bg-[#171717] hover:bg-[#F26A3D] text-white" })}>Back to Arcade</Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const GameComponent = game.component;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-full text-[#171717] font-sans pb-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#D8D4CC]">
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="gap-2 text-[#555555] hover:text-[#171717] px-0 hover:bg-transparent"
            >
              <ChevronLeft size={16} /> Back to Library
            </Button>
            <div className="flex items-center gap-2 font-bold text-sm text-[#F26A3D] bg-[#FAF9F5] px-4 py-1.5 rounded-full border border-[#D8D4CC]">
              <Zap size={16} /> {totalXP} XP
            </div>
          </header>
          
          {!hasStarted ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-[#D8D4CC] shadow-sm max-w-3xl mx-auto text-center">
              <div 
                className="p-4 rounded-full mb-6"
                style={{ backgroundColor: `${game.color}15`, color: game.color }}
              >
                <Gamepad2 size={48} />
              </div>
              <h2 className="text-3xl font-extrabold text-[#171717] uppercase tracking-tight mb-2">{game.name}</h2>
              <p className="text-[#666666] max-w-md mx-auto mb-8 text-lg">
                {game.description}
              </p>
              <Button 
                onClick={() => setHasStarted(true)}
                className="bg-[#171717] hover:bg-[#F26A3D] text-white font-bold uppercase tracking-wider px-12 h-14 text-lg"
              >
                <Play size={20} className="mr-2" fill="currentColor" /> Start Game
              </Button>
            </div>
          ) : (
            <GameComponent />
          )}
        </div>
      </div>
      
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-[#D8D4CC] max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-2 uppercase tracking-tight text-[#171717]">Leave Game?</h3>
            <p className="text-[#666] mb-6 text-sm">Are you sure you want to exit? Your current game progress will be lost.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowExitConfirm(false)}>Cancel</Button>
              <Button onClick={() => router.push("/games")} className="bg-[#171717] hover:bg-[#F26A3D] text-white">Yes, Leave</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
