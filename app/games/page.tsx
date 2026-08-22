"use client";

import { useEffect } from "react";
import { useEPStore } from "@/lib/ep-store";
import { Lock, Play, Gamepad2, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DashboardShell } from "@/components/visual-editor/dashboard/DashboardShell";
import Link from "next/link";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { GAMES_CATALOG } from "./catalog";

export default function ArcadeHub() {
  const { ep, unlockedGames, isLoading, loadState, unlockGame } = useEPStore();
  const challengeXP = useProjectsStore((state) => state.getTotalEarnedPoints());
  const totalXP = ep + challengeXP;
  
  useEffect(() => {
    loadState();
  }, [loadState]);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F4F1EA] text-[#171717]">
          <p className="text-xl animate-pulse font-semibold">Loading Arcade...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-full text-[#171717] font-sans space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D4CC]">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-[#171717]">The Arcade</h1>
            <p className="text-xs text-[#666666] mt-1">
              Spend XP to unlock exclusive mini-games.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xl font-bold text-[#F26A3D]">
            <Zap size={20} /> {totalXP} XP
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {GAMES_CATALOG.map((game) => {
          const isUnlocked = unlockedGames[game.id];
          const canAfford = totalXP >= game.cost;

          return (
            <div 
              key={game.id} 
              className={`bg-[#FFFFFF] border rounded p-4 flex flex-col justify-between transition-colors shadow-xs ${
                isUnlocked 
                  ? "border-[#D8D4CC] hover:border-[#F26A3D]" 
                  : "border-[#E5E2DA] opacity-75 bg-[#FAF9F5]"
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded border flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: isUnlocked ? `${game.color}15` : '#E5E2DA', 
                      borderColor: isUnlocked ? `${game.color}30` : '#D8D4CC', 
                      color: isUnlocked ? game.color : '#888' 
                    }}
                  >
                    <Gamepad2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase text-[#171717]">{game.name}</h2>
                    <div className="text-[10px] font-mono font-bold uppercase text-[#888] mt-0.5">
                      {isUnlocked ? "UNLOCKED" : `${game.cost} XP REQUIRED`}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-[#666666] leading-relaxed mb-4">
                  {game.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E2DA]">
                {isUnlocked ? (
                  <Link 
                    href={`/games/${game.id}`} 
                    className={buttonVariants({ className: "w-full bg-[#171717] hover:bg-[#F26A3D] text-white text-xs font-bold uppercase rounded h-8 transition-colors gap-1.5 flex justify-center" })}
                  >
                    <Play size={13} fill="currentColor" /> Play
                  </Link>
                ) : (
                  <Button 
                    className={`w-full text-xs font-bold uppercase rounded h-8 gap-1.5 ${
                      canAfford 
                        ? "bg-[#F26A3D] hover:bg-[#E0592C] text-white" 
                        : "bg-[#E5E2DA] text-[#888] hover:bg-[#E5E2DA] cursor-not-allowed"
                    }`}
                    disabled={!canAfford}
                    onClick={async () => {
                      if (canAfford) {
                        await unlockGame(game.id, game.cost);
                      }
                    }}
                  >
                    <Lock size={13} /> {canAfford ? "Unlock Game" : "Locked"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
    </DashboardShell>
  );
}
