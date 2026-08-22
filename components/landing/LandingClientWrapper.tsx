"use client";

import React, { useState } from 'react';
import { IdePreferencesDrawer } from '@/components/landing/IdePreferencesDrawer';
import { Scroll3DBackgroundTrack } from '@/components/landing/Scroll3DBackgroundTrack';
import { IdePreferencesState } from '@/types/landing';
import { Sparkles } from 'lucide-react';

export function LandingClientWrapper({ children }: { children: React.ReactNode }) {
  const [idePreferences, setIdePreferences] = useState<IdePreferencesState>({
    theme: 'warm-paper',
    autoSave: true,
    formatOnSave: true,
    nodeSnapToGrid: true,
    telemetryDisabled: true,
    fontSize: 14,
    keybindings: 'standard',
  });
  const [isIdeDrawerOpen, setIsIdeDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdatePreferences = (updated: Partial<IdePreferencesState>) => {
    setIdePreferences((prev) => {
      const next = { ...prev, ...updated };
      showToast(`IDE preference updated: ${Object.keys(updated).join(', ')}`);
      return next;
    });
  };

  const handleResetPreferences = () => {
    setIdePreferences({
      theme: 'warm-paper',
      autoSave: true,
      formatOnSave: true,
      nodeSnapToGrid: true,
      telemetryDisabled: true,
      fontSize: 14,
      keybindings: 'standard',
    });
    showToast('Reset IDE preferences to defaults');
  };

  return (
    <LandingContext.Provider value={{ openDrawer: () => setIsIdeDrawerOpen(true) }}>
      <div
        id="logicpup-app-root"
        className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
          idePreferences.theme === 'dark-slate'
            ? 'bg-[#0F172A] text-[#F8FAFC]'
            : idePreferences.theme === 'high-contrast'
            ? 'bg-[#000000] text-[#FFFFFF]'
            : 'bg-[#F4F1EA] text-[#171717]'
        }`}
        style={{
          '--theme-bg': idePreferences.theme === 'dark-slate' ? '#0F172A' : idePreferences.theme === 'high-contrast' ? '#000000' : '#F4F1EA'
        } as React.CSSProperties}
      >
        {toastMessage && (
          <div
            id="logicpup-toast-notification"
            className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-4 py-3 rounded-sm border border-white/15 shadow-xl flex items-center gap-2.5 font-mono text-xs animate-in slide-in-from-bottom-5 duration-200"
          >
            <Sparkles className="w-4 h-4 text-[#F26A3D]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <Scroll3DBackgroundTrack />

        {children}

        <IdePreferencesDrawer
          isOpen={isIdeDrawerOpen}
          onClose={() => setIsIdeDrawerOpen(false)}
          preferences={idePreferences}
          onUpdatePreferences={handleUpdatePreferences}
          onResetPreferences={handleResetPreferences}
        />
      </div>
    </LandingContext.Provider>
  );
}

export const LandingContext = React.createContext({
  openDrawer: () => {},
});
