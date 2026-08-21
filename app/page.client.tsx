"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveEditorDemo } from '@/components/landing/InteractiveEditorDemo';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CurriculumProgression } from '@/components/landing/CurriculumProgression';
import { IdePreferencesDrawer } from '@/components/landing/IdePreferencesDrawer';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';
import { Scroll3DBackgroundTrack } from '@/components/landing/Scroll3DBackgroundTrack';
import { IdePreferencesState } from '@/types/landing';
import { Sparkles } from 'lucide-react';

export default function App() {
  const router = useRouter();

  // Keep track of how the user likes their editor set up
  const [idePreferences, setIdePreferences] = useState<IdePreferencesState>({
    theme: 'warm-paper',
    autoSave: true,
    formatOnSave: true,
    nodeSnapToGrid: true,
    telemetryDisabled: true,
    fontSize: 14,
    keybindings: 'standard',
  });

  // Are the popups open or closed? Let's keep track here
  const [isIdeDrawerOpen, setIsIdeDrawerOpen] = useState<boolean>(false);

  // Those little messages that slide in to say hello
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

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    // Send them straight to the login page so they can get started!
    router.push(`/login?mode=${mode}`);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
      {/* The popup message that slides down from the top */}
      {toastMessage && (
        <div
          id="logicpup-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-4 py-3 rounded-sm border border-white/15 shadow-xl flex items-center gap-2.5 font-mono text-xs animate-in slide-in-from-bottom-5 duration-200"
        >
          <Sparkles className="w-4 h-4 text-[#F26A3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* All the cool 3D shapes floating in the background */}
      <Scroll3DBackgroundTrack />

      {/* The top bar to get around the site */}
      <Header
        onOpenIdePreferences={() => setIsIdeDrawerOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onOpenDemo={() => handleScrollToSection('interactive-demo-playground')}
      />

      {/* The meat and potatoes of the page */}
      <main className="flex-1">
        {/* 1. The big intro with the interactive flowchart */}
        <HeroSection
          onStartLearning={() => handleOpenAuth('signup')}
          onExploreDemo={() => handleScrollToSection('interactive-demo-playground')}
        />

        {/* 3. Where they can actually play with the editor */}
        <InteractiveEditorDemo />

        {/* 4. Showing off all the cool things we can do */}
        <FeaturesSection
          onOpenIdePreferences={() => setIsIdeDrawerOpen(true)}
          onStartLearning={() => handleOpenAuth('signup')}
        />

        {/* 5. The learning path they'll take */}
        <CurriculumProgression
          onStartLearning={() => handleOpenAuth('signup')}
        />

        {/* 6. The final push to get them to sign up! */}
        <CtaSection
          onStartLearning={() => handleOpenAuth('signup')}
          onExploreDemo={() => handleScrollToSection('interactive-demo-playground')}
        />
      </main>

      {/* The boring but necessary links at the bottom */}
      <Footer />

      {/* The popup where they can tweak their editor settings */}
      <IdePreferencesDrawer
        isOpen={isIdeDrawerOpen}
        onClose={() => setIsIdeDrawerOpen(false)}
        preferences={idePreferences}
        onUpdatePreferences={handleUpdatePreferences}
        onResetPreferences={handleResetPreferences}
      />
    </div>
  );
}
