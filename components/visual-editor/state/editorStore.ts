"use client";

import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import type { BlockNodeData, ExecutionState, LayoutMode } from "../ast/types";
import { parseProgram } from "../ast/parser";
import { pythonGenerator } from "../generators/python/generator";
import { useProjectsStore } from "../projects/projectStore";

// ─────────────────────────────────────────────────────────────────────────────
// Editor Store
// ─────────────────────────────────────────────────────────────────────────────

export type BlockNode = Node<BlockNodeData>;
export type BlockEdge = Edge;

export interface InputPromptRequest {
  nodeId: string;
  promptText: string;
  variableName: string;
  resolve: (value: string) => void;
}

interface HistoryEntry {
  nodes: BlockNode[];
  edges: BlockEdge[];
}

interface EditorState {
  activeProjectId: string | null;
  nodes: BlockNode[];
  edges: BlockEdge[];
  layoutMode: LayoutMode;
  libraryCollapsed: boolean;
  codeCollapsed: boolean;
  selectedNodeId: string | null;
  helpBlockType: string | null;
  generatedCode: string;
  nodeLineMap: Map<string, number>;
  execution: ExecutionState;
  pendingInput: InputPromptRequest | null;
  taskPanelOpen: boolean;
  history: HistoryEntry[];
  future: HistoryEntry[];
}

interface EditorActions {
  loadProjectProgram: (projectId: string, nodes: BlockNode[], edges: BlockEdge[]) => void;
  onNodesChange: (changes: NodeChange<BlockNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNodeId: (id: string | null) => void;
  addNode: (node: BlockNode) => void;
  updateNodeValue: (nodeId: string, key: string, value: unknown) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setLibraryCollapsed: (v: boolean) => void;
  setCodeCollapsed: (v: boolean) => void;
  setTaskPanelOpen: (v: boolean) => void;
  openHelp: (blockType: string) => void;
  closeHelp: () => void;
  setExecution: (state: ExecutionState) => void;
  setInputPrompt: (request: InputPromptRequest | null) => void;
  submitInputPrompt: (value: string) => void;
  regenerateCode: () => void;
  resetToBlankCanvas: () => void;
  undo: () => void;
  redo: () => void;
}

const defaultExecution: ExecutionState = {
  status: "idle",
  output: [],
  variables: {},
  executingNodeId: null,
  executedNodeIds: [],
  error: null,
};

function generateCode(nodes: BlockNode[], edges: BlockEdge[]) {
  try {
    const program = parseProgram(nodes, edges);
    const result = pythonGenerator.generate(program.ast);
    return { generatedCode: result.code, nodeLineMap: result.nodeLineMap };
  } catch {
    return { generatedCode: "# (error generating code)", nodeLineMap: new Map<string, number>() };
  }
}

// Debounced autosave timer
let autosaveTimeout: ReturnType<typeof setTimeout> | null = null;

function triggerAutoSave(projectId: string | null, nodes: BlockNode[], edges: BlockEdge[], code: string) {
  if (!projectId) return;

  const projectStore = useProjectsStore.getState();
  projectStore.setSaveStatus("saving");

  if (autosaveTimeout) clearTimeout(autosaveTimeout);
  autosaveTimeout = setTimeout(() => {
    projectStore.saveVisualProgram(projectId, nodes, edges, code);
  }, 400);
}

export const useEditorStore = create<EditorState & EditorActions>()((set, get) => ({
  activeProjectId: null,
  nodes: [],
  edges: [],
  layoutMode: "split",
  libraryCollapsed: false,
  codeCollapsed: false,
  selectedNodeId: null,
  helpBlockType: null,
  generatedCode: "",
  nodeLineMap: new Map<string, number>(),
  execution: defaultExecution,
  pendingInput: null,
  taskPanelOpen: false,
  history: [],
  future: [],

  loadProjectProgram(projectId, nodes, edges) {
    const code = generateCode(nodes, edges);
    set({
      activeProjectId: projectId,
      nodes,
      edges,
      ...code,
      history: [],
      future: [],
      execution: defaultExecution,
      selectedNodeId: null,
    });
  },

  onNodesChange(changes) {
    set((s) => {
      const prev = { nodes: s.nodes, edges: s.edges };
      const nodes = applyNodeChanges(changes, s.nodes) as BlockNode[];
      const code = generateCode(nodes, s.edges);

      triggerAutoSave(s.activeProjectId, nodes, s.edges, code.generatedCode);

      return {
        nodes,
        ...code,
        history: [...s.history.slice(-49), prev],
        future: [],
      };
    });
  },

  onEdgesChange(changes) {
    set((s) => {
      const prev = { nodes: s.nodes, edges: s.edges };
      const edges = applyEdgeChanges(changes, s.edges) as BlockEdge[];
      const code = generateCode(s.nodes, edges);

      triggerAutoSave(s.activeProjectId, s.nodes, edges, code.generatedCode);

      return {
        edges,
        ...code,
        history: [...s.history.slice(-49), prev],
        future: [],
      };
    });
  },

  onConnect(connection) {
    set((s) => {
      const prev = { nodes: s.nodes, edges: s.edges };
      const edges = addEdge(connection, s.edges) as BlockEdge[];
      const code = generateCode(s.nodes, edges);

      triggerAutoSave(s.activeProjectId, s.nodes, edges, code.generatedCode);

      return {
        edges,
        ...code,
        history: [...s.history.slice(-49), prev],
        future: [],
      };
    });
  },

  setSelectedNodeId(id) {
    set({ selectedNodeId: id });
  },

  addNode(node) {
    set((s) => {
      const prev = { nodes: s.nodes, edges: s.edges };
      const nodes = [...s.nodes, node];
      const code = generateCode(nodes, s.edges);

      triggerAutoSave(s.activeProjectId, nodes, s.edges, code.generatedCode);

      return { nodes, ...code, history: [...s.history.slice(-49), prev], future: [] };
    });
  },

  updateNodeValue(nodeId, key, value) {
    set((s) => {
      const nodes = s.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, values: { ...n.data.values, [key]: value } } }
          : n
      );
      const code = generateCode(nodes, s.edges);
      triggerAutoSave(s.activeProjectId, nodes, s.edges, code.generatedCode);

      const execution =
        s.execution.status === "finished" || s.execution.status === "error"
          ? {
              status: "idle" as const,
              output: s.execution.output,
              variables: s.execution.variables,
              executingNodeId: null,
              executedNodeIds: [],
              error: null,
            }
          : s.execution;

      return { nodes, execution, ...code };
    });
  },

  setLayoutMode(mode) { set({ layoutMode: mode }); },
  setLibraryCollapsed(v) { set({ libraryCollapsed: v }); },
  setCodeCollapsed(v) { set({ codeCollapsed: v }); },
  setTaskPanelOpen(v) { set({ taskPanelOpen: v }); },
  openHelp(blockType) { set({ helpBlockType: blockType }); },
  closeHelp() { set({ helpBlockType: null }); },

  setExecution(state) {
    const nodes = get().nodes.map((n) => ({
      ...n,
      data: { ...n.data, isExecuting: n.id === state.executingNodeId },
    }));
    set({ execution: state, nodes });
  },

  setInputPrompt(request) {
    set({ pendingInput: request });
  },

  submitInputPrompt(value) {
    const { pendingInput } = get();
    if (pendingInput) {
      pendingInput.resolve(value);
      set({ pendingInput: null });
    }
  },

  regenerateCode() {
    set((s) => generateCode(s.nodes, s.edges));
  },

  resetToBlankCanvas() {
    const blankNodes: BlockNode[] = [
      {
        id: "start-1",
        type: "startBlock",
        position: { x: 260, y: 60 },
        data: { blockType: "start", label: "Start", category: "program", color: "#555555", icon: "Play", values: {} },
        deletable: false,
      },
      {
        id: "end-1",
        type: "endBlock",
        position: { x: 260, y: 260 },
        data: { blockType: "end", label: "End", category: "program", color: "#555555", icon: "Square", values: {} },
        deletable: false,
      },
    ];
    const blankEdges: BlockEdge[] = [
      { id: "e1", source: "start-1", sourceHandle: "flow-out", target: "end-1", targetHandle: "flow-in" },
    ];
    const code = generateCode(blankNodes, blankEdges);
    set((s) => {
      triggerAutoSave(s.activeProjectId, blankNodes, blankEdges, code.generatedCode);
      return {
        nodes: blankNodes,
        edges: blankEdges,
        ...code,
        selectedNodeId: null,
        execution: defaultExecution,
        history: [...s.history.slice(-49), { nodes: s.nodes, edges: s.edges }],
        future: [],
      };
    });
  },

  undo() {
    set((s) => {
      if (s.history.length === 0) return s;
      const prev = s.history[s.history.length - 1];
      const code = generateCode(prev.nodes, prev.edges);
      triggerAutoSave(s.activeProjectId, prev.nodes, prev.edges, code.generatedCode);

      return {
        ...prev,
        ...code,
        history: s.history.slice(0, -1),
        future: [{ nodes: s.nodes, edges: s.edges }, ...s.future.slice(0, 49)],
      };
    });
  },

  redo() {
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      const code = generateCode(next.nodes, next.edges);
      triggerAutoSave(s.activeProjectId, next.nodes, next.edges, code.generatedCode);

      return {
        ...next,
        ...code,
        history: [...s.history.slice(-49), { nodes: s.nodes, edges: s.edges }],
        future: s.future.slice(1),
      };
    });
  },
}));
