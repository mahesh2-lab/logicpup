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

  // Global IDE Preferences State
  const [idePreferences, setIdePreferences] = useState<IdePreferencesState>({
    theme: 'warm-paper',
    autoSave: true,
    formatOnSave: true,
    nodeSnapToGrid: true,
    telemetryDisabled: true,
    fontSize: 14,
    keybindings: 'standard',
  });

  // Modal & Drawer UI State
  const [isIdeDrawerOpen, setIsIdeDrawerOpen] = useState<boolean>(false);

  // Toast Notification state
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
    // Redirect directly to actual login page for better-auth
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
      id="teachflow-app-root"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        idePreferences.theme === 'dark-slate'
          ? 'bg-[#0F172A] text-[#F8FAFC]'
          : idePreferences.theme === 'high-contrast'
          ? 'bg-[#000000] text-[#FFFFFF]'
          : 'bg-[#F4F1EA] text-[#171717]'
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          id="teachflow-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-4 py-3 rounded-xl border border-white/15 shadow-xl flex items-center gap-2.5 font-mono text-xs animate-in slide-in-from-bottom-5 duration-200"
        >
          <Sparkles className="w-4 h-4 text-[#F26A3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Background 3D Scroll Track Models */}
      <Scroll3DBackgroundTrack />

      {/* Navigation Header */}
      <Header
        onOpenIdePreferences={() => setIsIdeDrawerOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onOpenDemo={() => handleScrollToSection('interactive-demo-playground')}
      />

      {/* Main Page Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with 3D WebGL Living Logic Graph & React Flow Node Canvas */}
        <HeroSection
          onStartLearning={() => handleOpenAuth('signup')}
          onExploreDemo={() => handleScrollToSection('interactive-demo-playground')}
        />

        {/* 3. Interactive In-Browser Node Playground */}
        <InteractiveEditorDemo />

        {/* 4. 5 Key Features Showcase */}
        <FeaturesSection
          onOpenIdePreferences={() => setIsIdeDrawerOpen(true)}
          onStartLearning={() => handleOpenAuth('signup')}
        />

        {/* 5. Curriculum Progression & Locked-Level Track */}
        <CurriculumProgression
          onStartLearning={() => handleOpenAuth('signup')}
        />

        {/* 6. Call to Action Banner */}
        <CtaSection
          onStartLearning={() => handleOpenAuth('signup')}
          onExploreDemo={() => handleScrollToSection('interactive-demo-playground')}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* In-Browser IDE Preferences Modal */}
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
