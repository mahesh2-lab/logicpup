export type PythonNodeType =
  | 'start'
  | 'end'
  | 'process'
  | 'input'
  | 'condition'
  | 'loop'
  | 'output';

export interface PortDefinition {
  id: string;
  name: string;
  type?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  nodeType: PythonNodeType;
  subtitle?: string;
  pythonCode: string;
  explanation: string;
  status: 'idle' | 'running' | 'active' | 'success' | 'error';
  variableName?: string;
  variableValue?: any;
  conditionExpr?: string;
  outputMessage?: string;
  inputPrompt?: string;
  onInspect?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onUpdateCode?: (nodeId: string, code: string) => void;
}

export interface PythonVariable {
  name: string;
  value: any;
  type: string;
}

export interface PythonPreset {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  pythonSnippet: string;
  defaultInput?: string;
  nodes: any[];
  edges: any[];
}

export interface PythonConsoleLog {
  id: string;
  type: 'stdout' | 'stdin' | 'system' | 'error';
  text: string;
  timestamp: string;
}
