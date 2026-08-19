"use client";

import React from "react";
import {
  FileCode,
  Target,
  Calculator,
  HelpCircle,
  Gamepad2,
  Folder,
  GraduationCap,
  Bot,
  Palette,
  Globe,
  Rocket,
  Lightbulb,
  Blocks,
  Code2,
  Trophy,
  Sparkles,
  Terminal,
  Variable,
  GitBranch,
  Repeat,
  School,
  type LucideProps,
} from "lucide-react";

export interface DynamicIconProps extends LucideProps {
  name: string;
}

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  // Templates & Code
  empty: FileCode,
  FileCode,
  "guessing-game": Target,
  Target,
  calculator: Calculator,
  Calculator,
  quiz: HelpCircle,
  HelpCircle,
  Blocks,
  Code2,
  Terminal,

  // Collections & Categories
  game: Gamepad2,
  Gamepad2,
  math: Calculator,
  folder: Folder,
  Folder,
  bot: Bot,
  Bot,
  palette: Palette,
  Palette,
  globe: Globe,
  Globe,
  rocket: Rocket,
  Rocket,
  lightbulb: Lightbulb,
  Lightbulb,
  trophy: Trophy,
  Trophy,
  sparkles: Sparkles,
  Sparkles,

  // Education
  school: School,
  School,
  graduation: GraduationCap,
  GraduationCap,

  // Programming Concepts
  variables: Variable,
  Variable,
  conditions: GitBranch,
  GitBranch,
  loops: Repeat,
  Repeat,
};

// Fallback mapping for older emoji representations
const EMOJI_MAP: Record<string, React.ComponentType<LucideProps>> = {
  "📄": FileCode,
  "🎯": Target,
  "🔢": Calculator,
  "💬": HelpCircle,
  "🎮": Gamepad2,
  "📐": Calculator,
  "📁": Folder,
  "🏫": School,
  "🎓": GraduationCap,
  "🤖": Bot,
  "🎨": Palette,
  "🌐": Globe,
  "🚀": Rocket,
  "💡": Lightbulb,
  "🧱": Blocks,
  "📦": Variable,
  "❓": HelpCircle,
  "🔄": Repeat,
  "🔁": Repeat,
};

export function DynamicIcon({ name, size = 16, color, className, ...props }: DynamicIconProps) {
  const IconComponent = ICON_MAP[name] || EMOJI_MAP[name] || FileCode;
  return <IconComponent size={size} color={color} className={className} {...props} />;
}

export { DynamicIcon as IconRenderer };
