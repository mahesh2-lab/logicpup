import React from 'react';
import {
  X,
  Sliders,
  Check,
  Moon,
  Sun,
  Layout,
  Cpu,
  Keyboard,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { IdePreferencesState } from '../../types/landing';

interface IdePreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: IdePreferencesState;
  onUpdatePreferences: (updated: Partial<IdePreferencesState>) => void;
  onResetPreferences?: () => void;
}

export const IdePreferencesDrawer: React.FC<IdePreferencesDrawerProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onResetPreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="ide-preferences-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        id="ide-preferences-drawer-panel"
        className="w-full max-w-md bg-[#FAF9F5] h-full shadow-2xl border-l border-black/[0.08] flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#356A9A] text-white flex items-center justify-center shadow-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#121212]">
                  IDE Preferences
                </h3>
                <p className="text-xs text-[#666666]">
                  Local-first sandbox runtime settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-[#666666] hover:text-[#121212] hover:bg-black/[0.04] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preferences Section: Theme */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold text-[#806A55] uppercase">
              Editor Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'warm-paper', label: 'Warm Paper', icon: Sun },
                { id: 'dark-slate', label: 'Dark Slate', icon: Moon },
                { id: 'high-contrast', label: 'Contrast', icon: Layout },
              ].map((t) => {
                const isSelected = preferences.theme === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() =>
                      onUpdatePreferences({ theme: t.id as IdePreferencesState['theme'] })
                    }
                    className={`p-3 rounded-sm border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#121212] shadow-sm text-[#121212] ring-2 ring-black/[0.04]'
                        : 'bg-white/60 border-black/[0.06] text-[#666666] hover:bg-white hover:text-[#121212]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences Section: Toggles */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-mono font-bold text-[#806A55] uppercase">
              Editor Ergonomics & Persistence
            </label>

            {/* Auto Save */}
            <div className="flex items-center justify-between p-3 bg-white rounded-sm border border-black/[0.06] shadow-xs">
              <div>
                <div className="font-bold text-xs text-[#121212]">
                  Auto-Save
                </div>
                <div className="text-[11px] text-[#666666]">
                  Write changes directly to local storage
                </div>
              </div>
              <button
                onClick={() =>
                  onUpdatePreferences({ autoSave: !preferences.autoSave })
                }
                className={`w-10 h-6 rounded-sm transition-colors relative cursor-pointer ${
                  preferences.autoSave ? 'bg-[#287A52]' : 'bg-black/15'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-sm bg-white transition-transform absolute top-1 ${
                    preferences.autoSave ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Format on Save */}
            <div className="flex items-center justify-between p-3 bg-white rounded-sm border border-black/[0.06] shadow-xs">
              <div>
                <div className="font-bold text-xs text-[#121212]">
                  Format Node Graph on Save
                </div>
                <div className="text-[11px] text-[#666666]">
                  Auto-align wire layout and node coordinates
                </div>
              </div>
              <button
                onClick={() =>
                  onUpdatePreferences({
                    formatOnSave: !preferences.formatOnSave,
                  })
                }
                className={`w-10 h-6 rounded-sm transition-colors relative cursor-pointer ${
                  preferences.formatOnSave ? 'bg-[#287A52]' : 'bg-black/15'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-sm bg-white transition-transform absolute top-1 ${
                    preferences.formatOnSave ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Node Snap to Grid */}
            <div className="flex items-center justify-between p-3 bg-white rounded-sm border border-black/[0.06] shadow-xs">
              <div>
                <div className="font-bold text-xs text-[#121212]">
                  Snap Nodes to 20px Grid
                </div>
                <div className="text-[11px] text-[#666666]">
                  Clean 20px magnetic grid snapping
                </div>
              </div>
              <button
                onClick={() =>
                  onUpdatePreferences({
                    nodeSnapToGrid: !preferences.nodeSnapToGrid,
                  })
                }
                className={`w-10 h-6 rounded-sm transition-colors relative cursor-pointer ${
                  preferences.nodeSnapToGrid ? 'bg-[#287A52]' : 'bg-black/15'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-sm bg-white transition-transform absolute top-1 ${
                    preferences.nodeSnapToGrid ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Keybindings */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-mono font-bold text-[#806A55] uppercase">
              Keybinding Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['standard', 'vim', 'emacs'].map((kb) => (
                <button
                  key={kb}
                  onClick={() =>
                    onUpdatePreferences({
                      keybindings: kb as IdePreferencesState['keybindings'],
                    })
                  }
                  className={`py-2 px-3 rounded-sm text-xs font-mono capitalize transition-all cursor-pointer ${
                    (preferences.keybindings || 'standard') === kb
                      ? 'bg-[#121212] text-white font-bold'
                      : 'bg-white border border-black/[0.06] text-[#666666] hover:text-[#121212]'
                  }`}
                >
                  {kb}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="pt-6 border-t border-black/[0.06] space-y-2">
          {onResetPreferences && (
            <button
              onClick={onResetPreferences}
              className="w-full py-2.5 px-4 rounded-sm border border-black/[0.08] hover:bg-black/[0.04] text-xs font-semibold text-[#666666] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Factory Defaults</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-sm bg-[#F26A3D] hover:bg-[#D9552A] active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
