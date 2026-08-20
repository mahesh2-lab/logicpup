export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  accentColor: string;
  tag: string;
  capabilities: string[];
  mockVisualType: 'node-editor' | 'curriculum' | 'ide-settings' | 'run-terminal' | 'user-hub';
}

export interface CurriculumLevel {
  levelNumber: number;
  title: string;
  description: string;
  locked: boolean;
  completed: boolean;
  challengesCount: number;
  xpReward: number;
  skillsCovered: string[];
  tag: string;
}

export interface IdePreferencesState {
  theme: 'warm-paper' | 'dark-slate' | 'high-contrast';
  autoSave: boolean;
  formatOnSave: boolean;
  nodeSnapToGrid: boolean;
  telemetryDisabled: boolean;
  fontSize: number;
  minimap?: boolean;
  keybindings?: 'standard' | 'vim' | 'emacs';
}
