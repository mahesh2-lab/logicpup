import type { BlockNode, BlockEdge } from "../state/editorStore";

export type ProjectStatus = "draft" | "active" | "completed" | "archived";
export type ProjectLanguage = "python" | "javascript";

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
  isMain?: boolean;
  updatedAt: string;
}

export interface ProjectRun {
  id: string;
  runNumber: number;
  status: "success" | "error" | "cancelled";
  durationMs: number;
  output: string[];
  variables: Record<string, unknown>;
  error: string | null;
  timestamp: string;
}

export interface ProjectActivity {
  id: string;
  type: "created" | "block_added" | "block_modified" | "run" | "error_fixed" | "renamed" | "saved" | "task_completed" | "challenge_completed";
  description: string;
  timestamp: string;
}

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  inputs?: string[];
  expectedOutputs: string[];
}

export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeFormat = "build" | "debug" | "complete" | "predict" | "real_world";

export interface LevelChallenge {
  id: string;
  levelId: string;
  levelNumber: number;
  title: string;
  difficulty: ChallengeDifficulty;
  format: ChallengeFormat;
  formatLabel: string;
  description: string;
  goal: string;
  hint: string;
  points: number;
  starterNodes?: BlockNode[];
  starterEdges?: BlockEdge[];
  testCases: TestCase[];
  completed?: boolean;
}

export interface LevelLearningMaterial {
  conceptTitle: string;
  summary: string;
  explanation: string[];
  blockExamples: {
    name: string;
    blockType: string;
    purpose: string;
    exampleCode: string;
  }[];
  codeSnippets: {
    title: string;
    pythonCode: string;
    explanation: string;
  }[];
  commonMistakes: {
    mistake: string;
    fix: string;
    why: string;
  }[];
  keyTakeaways: string[];
}

export interface CodingLevel {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  description: string;
  requiredChallengesToMaster: number;
  learning: LevelLearningMaterial;
  challenges: LevelChallenge[];
}

export interface ProjectLearningState {
  progress: number;
  levelId?: string;
  challengeId?: string;
  currentChallenge?: LevelChallenge;
}

export interface ProjectSettings {
  autoSave: boolean;
  formatOnSave: boolean;
  visibility: "private" | "public";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: ProjectLanguage;
  templateId: string;
  status: ProjectStatus;
  progress: number;
  ownerId?: string | null;
  createdAt: string;
  updatedAt: string;
  lastEditedAt: string;
  visualProgram: {
    nodes: BlockNode[];
    edges: BlockEdge[];
  };
  files: ProjectFile[];
  runs: ProjectRun[];
  activity: ProjectActivity[];
  learningState?: ProjectLearningState;
  settings: ProjectSettings;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  language: ProjectLanguage;
  icon: string;
  badge: string;
  starterNodes: BlockNode[];
  starterEdges: BlockEdge[];
  starterFiles?: ProjectFile[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
}
