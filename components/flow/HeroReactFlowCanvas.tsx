import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  MarkerType,
} from '@xyflow/react';
import {
  Play,
  RefreshCw,
  Plus,
  Zap,
  CheckCircle2,
  Code2,
  Terminal,
  Trash2,
  Info,
  Layers,
  ArrowRight,
  FileCode,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronRight,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { pythonNodeTypes } from './CustomNodes';
import { CustomNodeData, PythonNodeType, PythonPreset, PythonConsoleLog, PythonVariable } from './types';
import { generatePythonFromFlow } from './CodeGenerator';

// Presets for Python Code Flowcharts
const PYTHON_PRESETS: Record<string, PythonPreset> = {
  guessingGame: {
    id: 'guessingGame',
    title: 'Number Guessing Game (Screenshot)',
    category: 'Conditionals & Loops',
    difficulty: 'Beginner',
    description: 'Exact diagram from screenshot: initializes secret number, prompts for user guess, checks match condition, and branches to victory or retry.',
    defaultInput: '7',
    pythonSnippet: `secret = 7\nguess = int(input("Enter guess: "))\nif guess == secret:\n    print("Victory!")\nelse:\n    print("Try again")`,
    nodes: [
      {
        id: 'node-start',
        type: 'start',
        position: { x: 260, y: 30 },
        data: {
          label: 'START',
          nodeType: 'start' as PythonNodeType,
          subtitle: 'Program begins here',
          pythonCode: '# Program begins here',
          explanation: 'Entry point of the Python execution context.',
          status: 'idle',
        },
      },
      {
        id: 'node-secret',
        type: 'process',
        position: { x: 580, y: 80 },
        data: {
          label: 'Set Secret Number',
          nodeType: 'process' as PythonNodeType,
          subtitle: 'secret_number = 7',
          pythonCode: 'secret_number = 7',
          explanation: 'Assigns integer literal 7 to variable secret_number in memory.',
          status: 'idle',
          variableName: 'secret_number',
          variableValue: 7,
        },
      },
      {
        id: 'node-guess',
        type: 'input',
        position: { x: 460, y: 260 },
        data: {
          label: 'Ask for Guess',
          nodeType: 'input' as PythonNodeType,
          subtitle: 'guess = int(input())',
          pythonCode: 'guess = int(input("Enter your guess: "))',
          explanation: 'Reads integer input from user via terminal stdin.',
          status: 'idle',
          variableName: 'guess',
          variableValue: 7,
        },
      },
      {
        id: 'node-check',
        type: 'condition',
        position: { x: 160, y: 290 },
        data: {
          label: 'Check Match',
          nodeType: 'condition' as PythonNodeType,
          subtitle: 'if guess == secret_number',
          pythonCode: 'if guess == secret_number:',
          explanation: 'Evaluates equality comparison between guess and secret_number.',
          status: 'idle',
          conditionExpr: 'guess == secret_number',
        },
      },
      {
        id: 'node-victory',
        type: 'output',
        position: { x: 90, y: 460 },
        data: {
          label: 'Victory Message',
          nodeType: 'output' as PythonNodeType,
          subtitle: 'print("Victory! You won!")',
          pythonCode: 'print("🎉 Victory! You guessed the secret number!")',
          explanation: 'Prints success message to console and concludes program.',
          status: 'idle',
          outputMessage: 'Victory! You guessed the secret number!',
        },
      },
      {
        id: 'node-retry',
        type: 'output',
        position: { x: 680, y: 480 },
        data: {
          label: 'Try Again',
          nodeType: 'output' as PythonNodeType,
          subtitle: 'print("Try again")',
          pythonCode: 'print("❌ Wrong guess, try again!")',
          explanation: 'Prints hint to retry and branches to next iteration.',
          status: 'idle',
          outputMessage: 'Wrong guess, try again!',
        },
      },
      {
        id: 'node-end',
        type: 'end',
        position: { x: 280, y: 600 },
        data: {
          label: 'END',
          nodeType: 'end' as PythonNodeType,
          subtitle: 'Program ends here',
          pythonCode: '# Program ends here',
          explanation: 'Terminates the program execution cycle.',
          status: 'idle',
        },
      },
    ],
    edges: [
      {
        id: 'e-start-secret',
        source: 'node-start',
        target: 'node-secret',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        animated: true,
        style: { stroke: '#171717', strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
      },
      {
        id: 'e-secret-guess',
        source: 'node-secret',
        target: 'node-guess',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        animated: true,
        style: { stroke: '#171717', strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
      },
      {
        id: 'e-guess-check',
        source: 'node-guess',
        target: 'node-check',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        animated: true,
        style: { stroke: '#171717', strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
      },
      {
        id: 'e-check-victory',
        source: 'node-check',
        target: 'node-victory',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        label: 'True (Match)',
        labelStyle: { fill: '#287A52', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
        animated: true,
        style: { stroke: '#287A52', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#287A52' },
      },
      {
        id: 'e-check-retry',
        source: 'node-check',
        target: 'node-retry',
        sourceHandle: 'bottom',
        targetHandle: 'left',
        label: 'False (No Match)',
        labelStyle: { fill: '#C94A45', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
        animated: true,
        style: { stroke: '#C94A45', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#C94A45' },
      },
      {
        id: 'e-victory-end',
        source: 'node-victory',
        target: 'node-end',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        animated: true,
        style: { stroke: '#171717', strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
      },
      {
        id: 'e-retry-end',
        source: 'node-retry',
        target: 'node-end',
        sourceHandle: 'right',
        targetHandle: 'left',
        animated: true,
        style: { stroke: '#171717', strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
      },
    ],
  },

};

export const HeroReactFlowCanvas: React.FC = () => {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('guessingGame');
  const [nodes, setNodes, onNodesChange] = useNodesState(PYTHON_PRESETS.guessingGame.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(PYTHON_PRESETS.guessingGame.edges);

  // Inspector & View tabs
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-secret');
  const [activeTab, setActiveTab] = useState<'canvas' | 'python' | 'terminal'>('canvas');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [showNodePalette, setShowNodePalette] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // User input simulation state
  const [userInputValue, setUserInputValue] = useState<string>('7');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<PythonConsoleLog[]>([
    { id: '1', type: 'system', text: 'LogicPup Python 3.12 Flowchart Interpreter ready. 🐾', timestamp: '00:00.00' },
    { id: '2', type: 'system', text: 'Loaded diagram: Number Guessing Game (Ready to fetch)', timestamp: '00:00.01' },
  ]);
  const [variables, setVariables] = useState<PythonVariable[]>([
    { name: 'secret_number', value: 7, type: 'int' },
    { name: 'guess', value: 7, type: 'int' },
    { name: 'is_match', value: true, type: 'bool' },
  ]);

  // Handle Connections
  const onConnect = useCallback(
    (params: Connection) => {
      const edge: Edge = {
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        animated: true,
        style: { stroke: '#171717', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const handleInspectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsInspectorOpen(true);
  }, []);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  // Bind node callbacks
  const processedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onInspect: handleInspectNode,
        onDelete: handleDeleteNode,
      },
    }));
  }, [nodes, handleInspectNode, handleDeleteNode]);

  // Preset Selection
  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    const preset = PYTHON_PRESETS[key];
    if (preset) {
      setNodes(preset.nodes);
      setEdges(preset.edges);
      setSelectedNodeId(preset.nodes[1]?.id || preset.nodes[0]?.id);
      setUserInputValue(preset.defaultInput || '7');
      setConsoleLogs([
        { id: `log-${Date.now()}`, type: 'system', text: `Loaded Python Diagram: ${preset.title}`, timestamp: '00:00.00' },
      ]);
    }
  };

  // Add Python Node from Palette
  const handleAddPythonNode = (nodeType: PythonNodeType, label: string, code: string, subtitle: string) => {
    const id = `node-${Date.now().toString().slice(-4)}`;
    const newNode: Node<CustomNodeData> = {
      id,
      type: nodeType,
      position: { x: 300 + Math.random() * 150, y: 150 + Math.random() * 150 },
      data: {
        label,
        nodeType,
        subtitle,
        pythonCode: code,
        explanation: `Executes Python statement: ${code}`,
        status: 'idle',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
    setShowNodePalette(false);
  };

  // Step-by-Step Python Execution Simulator
  const handleRunPython = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveTab('terminal');
    setConsoleLogs([]);

    const parsedGuess = parseInt(userInputValue, 10) || 7;
    const isMatch = parsedGuess === 7;

    // Reset status
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, status: 'idle' },
      }))
    );

    // Flow path sequence
    const executionPath = isMatch
      ? ['node-start', 'node-secret', 'node-guess', 'node-check', 'node-victory', 'node-end']
      : ['node-start', 'node-secret', 'node-guess', 'node-check', 'node-retry', 'node-end'];

    let step = 0;
    const interval = setInterval(() => {
      if (step < executionPath.length) {
        const nodeId = executionPath[step];
        const currentNode = nodes.find((n) => n.id === nodeId);

        // Highlight active node
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: {
              ...n.data,
              status: n.id === nodeId ? 'running' : 'idle',
            },
          }))
        );
        setSelectedNodeId(nodeId);

        // Append log corresponding to the node
        let logText = '';
        if (nodeId === 'node-start') {
          logText = '>>> [START] Executing Python Script: main.py';
        } else if (nodeId === 'node-secret') {
          logText = '>>> secret_number = 7 (stored in memory)';
          setVariables((v) => v.map((item) => item.name === 'secret_number' ? { ...item, value: 7 } : item));
        } else if (nodeId === 'node-guess') {
          logText = `>>> guess = int(input("Enter guess: ")) -> Received: ${parsedGuess}`;
          setVariables((v) => v.map((item) => item.name === 'guess' ? { ...item, value: parsedGuess } : item));
        } else if (nodeId === 'node-check') {
          logText = `>>> Evaluated (guess == secret_number) -> (${parsedGuess} == 7) => ${isMatch ? 'TRUE' : 'FALSE'}`;
          setVariables((v) => v.map((item) => item.name === 'is_match' ? { ...item, value: isMatch } : item));
        } else if (nodeId === 'node-victory') {
          logText = '>>> 🏆 print("🎉 Victory! You guessed the secret number!")';
        } else if (nodeId === 'node-retry') {
          logText = '>>> ❌ print("Wrong guess, try again!")';
        } else if (nodeId === 'node-end') {
          logText = '>>> [END] Program successfully exited (code 0)';
        }

        if (logText) {
          setConsoleLogs((prev) => [
            ...prev,
            {
              id: `log-${Date.now()}-${step}`,
              type: 'stdout',
              text: logText,
              timestamp: `00:0${(step * 0.4).toFixed(2)}s`,
            },
          ]);
        }

        step++;
      } else {
        clearInterval(interval);
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: { ...n.data, status: 'success' },
          }))
        );
        setIsRunning(false);

        if (isMatch) {
          try {
            confetti({
              particleCount: 65,
              spread: 70,
              origin: { y: 0.65 },
              colors: ['#F26A3D', '#287A52', '#356A9A'],
            });
          } catch (e) {}
        }
      }
    }, 550);
  };

  // Generate Python code
  const generatedPythonCode = useMemo(() => {
    return generatePythonFromFlow(nodes, edges);
  }, [nodes, edges]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedPythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div
      id="python-flowchart-ide"
      className="relative w-full h-[600px] sm:h-[680px] lg:h-[760px] rounded-[4px] bg-white border border-[#171717]/30 shadow-[0_12px_40px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 z-30 border-b border-[#D8D4CC] bg-[#F4F1EA]/95 backdrop-blur-md overflow-x-auto">
        {/* Top/Left: Diagram Title & Presets */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-[4px] border border-[#171717]/20 text-xs font-mono text-[#171717] shadow-xs whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#287A52] animate-pulse shrink-0" />
            <span className="font-bold truncate">Python Flowchart</span>
            <span className="text-[#806A55] hidden xl:inline shrink-0">• {nodes.length} Blocks</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-white p-1 h-9 rounded-[4px] border border-[#D8D4CC] text-xs font-mono">
            <span className="hidden lg:inline text-[11px] text-[#555555] px-2">Example:</span>
            {Object.entries(PYTHON_PRESETS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`px-2.5 h-full rounded-[3px] text-xs transition-all cursor-pointer whitespace-nowrap ${
                  selectedPresetKey === key
                    ? 'bg-[#F4F1EA] text-[#171717] font-bold border border-[#D8D4CC]'
                    : 'text-[#555555] hover:text-[#171717]'
                }`}
              >
                {val.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Center: View Mode (Visual Flowchart vs Python 3 Code vs Console) */}
        <div className="flex w-full md:w-auto justify-center items-center bg-white p-1 h-9 rounded-[4px] border border-[#D8D4CC] text-xs font-mono">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center justify-center gap-1.5 flex-1 md:flex-none px-3 h-full rounded-[3px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'canvas'
                ? 'bg-[#171717] text-white font-bold'
                : 'text-[#555555] hover:text-[#171717]'
            }`}
          >
            <span>Flowchart</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center justify-center gap-1.5 flex-1 md:flex-none px-3 h-full rounded-[3px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'python'
                ? 'bg-[#171717] text-white font-bold'
                : 'text-[#555555] hover:text-[#171717]'
            }`}
          >
            <Code2 className={`w-3.5 h-3.5 ${activeTab === 'python' ? 'text-white' : 'text-[#356A9A]'}`} />
            <span className="hidden sm:inline">Code</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center justify-center gap-1.5 flex-1 md:flex-none px-3 h-full rounded-[3px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-[#171717] text-white font-bold'
                : 'text-[#555555] hover:text-[#171717]'
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 ${activeTab === 'terminal' ? 'text-white' : 'text-[#287A52]'}`} />
            <span className="hidden sm:inline">Console</span>
            <span className="sm:hidden text-[10px]">({consoleLogs.length})</span>
          </button>
        </div>

        {/* Bottom/Right: Input Test Value & Run Python Button */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2 relative">
          {/* User Input Test Box */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 h-9 rounded-[4px] border border-[#D8D4CC] text-xs font-mono whitespace-nowrap">
            <span className="hidden lg:inline text-[11px] text-[#555555]">guess =</span>
            <input
              type="number"
              value={userInputValue}
              onChange={(e) => setUserInputValue(e.target.value)}
              className="w-8 sm:w-10 text-center font-bold text-[#171717] bg-[#F4F1EA] rounded-[2px] border border-[#D8D4CC] outline-none"
              title="Test input value"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Add Python Block Palette */}
            <button
              onClick={() => setShowNodePalette(!showNodePalette)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-[4px] bg-white border border-[#D8D4CC] hover:bg-[#F4F1EA] text-[#171717] text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#F26A3D]" />
              <span className="hidden lg:inline">Add Block</span>
            </button>

            {/* Dropdown for Python Statement Blocks */}
            {showNodePalette && (
              <div className="absolute top-12 right-0 w-64 bg-white rounded-[4px] border border-[#171717]/20 shadow-2xl p-2.5 z-40 space-y-1 animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#806A55] uppercase border-b border-[#D8D4CC]">
                  Add Python Block
                </div>
                <button
                  onClick={() => handleAddPythonNode('process', 'Set Variable', 'x = 10', 'x = 10')}
                  className="w-full px-2.5 py-2 rounded-[3px] text-left text-xs hover:bg-[#F4F1EA] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-[#171717]">Variable Assignment</div>
                    <div className="text-[10px] text-[#555555] font-mono">x = 10</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-[#555555]" />
                </button>

                <button
                  onClick={() => handleAddPythonNode('input', 'Ask for Input', 'val = input("Enter: ")', 'val = input()')}
                  className="w-full px-2.5 py-2 rounded-[3px] text-left text-xs hover:bg-[#F4F1EA] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-[#171717]">User Input</div>
                    <div className="text-[10px] text-[#555555] font-mono">input("Prompt: ")</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-[#555555]" />
                </button>

                <button
                  onClick={() => handleAddPythonNode('condition', 'Check Condition', 'if val > 0:', 'if val > 0')}
                  className="w-full px-2.5 py-2 rounded-[3px] text-left text-xs hover:bg-[#F4F1EA] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-[#171717]">If / Else Condition</div>
                    <div className="text-[10px] text-[#555555] font-mono">if condition:</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-[#555555]" />
                </button>

                <button
                  onClick={() => handleAddPythonNode('output', 'Print Message', 'print("Hello Python!")', 'print()')}
                  className="w-full px-2.5 py-2 rounded-[3px] text-left text-xs hover:bg-[#F4F1EA] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-[#171717]">Print Output</div>
                    <div className="text-[10px] text-[#555555] font-mono">print("Message")</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-[#555555]" />
                </button>
              </div>
            )}

            {/* Run Python Execution Button */}
            <button
              id="python-flow-run-btn"
              onClick={handleRunPython}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 sm:px-4 h-9 bg-[#F26A3D] hover:bg-[#D9552A] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-sm transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden lg:inline">Run Code</span>
                  <span className="lg:hidden">Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Middle Canvas & Code View */}
      <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Visual Flowchart Canvas */}
        {activeTab === 'canvas' && (
          <div className="relative flex-1 h-full min-h-[300px]">
            <ReactFlow
              nodes={processedNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={pythonNodeTypes}
              fitView
              snapToGrid={true}
              snapGrid={[20, 20]}
              preventScrolling={false}
              panOnScroll={true}
              zoomOnScroll={false}
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: '#171717', strokeWidth: 1.8 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
              }}
              className="bg-[#FAFAFA]"
            >
              {/* Square grid background matching user screenshot */}
              <Background variant={BackgroundVariant.Lines} gap={24} size={1} color="#E2E8F0" />
              <Controls className="bg-white rounded-[4px] border border-[#171717]/20 shadow-xs text-[#171717]" />
              <MiniMap
                nodeColor="#171717"
                className="hidden lg:block bg-white rounded-[4px] border border-[#171717]/20 shadow-xs"
                maskColor="rgba(244, 241, 234, 0.7)"
              />

              {/* Bottom Canvas Overlay Helper */}
              <Panel position="bottom-left" className="hidden sm:flex bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[4px] border border-[#171717]/20 text-[11px] font-mono text-[#555555] shadow-xs items-center gap-3">
                <span className="flex items-center gap-1.5 font-bold text-[#171717]">
                  <Zap className="w-3.5 h-3.5 text-[#F26A3D]" />
                  <span>Python 3.12 AST Simulator</span>
                </span>
                <span>•</span>
                <span>Connect handles (Top / Bottom / Left / Right) to reorder code</span>
              </Panel>
            </ReactFlow>
          </div>
        )}

        {/* Python 3 Code View */}
        {activeTab === 'python' && (
          <div className="relative flex-1 h-full bg-[#1E1E1E] text-white p-5 font-mono overflow-y-auto flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#F26A3D]" />
                  <span className="text-xs font-bold font-mono">main.py (Generated from Flowchart)</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#287A52]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Python'}</span>
                </button>
              </div>

              <pre className="text-xs leading-relaxed text-[#E2E8F0] font-mono overflow-x-auto p-3 bg-black/40 rounded-[4px] border border-white/5">
                <code>{generatedPythonCode}</code>
              </pre>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>Python 3.12 Compliant Syntax</span>
              <span>Visual-to-Code 1:1 Mapping</span>
            </div>
          </div>
        )}

        {/* Python Console & Variables Terminal */}
        {activeTab === 'terminal' && (
          <div className="relative flex-1 h-full bg-[#1E1E1E] text-white p-4 font-mono overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#287A52]" />
                  <span className="text-xs font-bold font-mono">Python 3.12 Interactive REPL Console</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-[3px] font-bold ${isRunning ? 'bg-[#F26A3D]/20 text-[#F26A3D]' : 'bg-[#287A52]/20 text-[#287A52]'}`}>
                  {isRunning ? 'EXECUTING' : 'IDLE'}
                </span>
              </div>

              {/* Real-time Variable Memory Watch Table */}
              <div className="bg-black/30 p-2.5 rounded-[4px] border border-white/10">
                <div className="text-[10px] text-white/50 font-bold mb-1.5 uppercase tracking-wider">
                  Python Memory Scope (Variables Watch)
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {variables.map((v) => (
                    <div key={v.name} className="bg-white/5 px-2 py-1 rounded-[2px] border border-white/5">
                      <span className="text-[#356A9A] font-bold">{v.name}</span>: <span className="text-[#4ade80]">{String(v.value)}</span> <span className="text-[9px] text-white/40">({v.type})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console stdout lines */}
              <div className="space-y-1.5 text-xs">
                {consoleLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`leading-relaxed ${
                      log.text.includes('Victory') || log.text.includes('TRUE')
                        ? 'text-[#4ade80] font-bold'
                        : log.text.includes('Wrong') || log.text.includes('FALSE')
                        ? 'text-[#f87171] font-bold'
                        : 'text-[#E2E8F0]'
                    }`}
                  >
                    {log.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
              <span>Standard Output (stdout)</span>
              <span>Exit code: 0</span>
            </div>
          </div>
        )}

        {/* Right Node Inspector Panel */}
        {isInspectorOpen && selectedNode && (
          <div className="hidden lg:flex w-72 h-full bg-white border-l border-[#D8D4CC] p-4 flex-col justify-between overflow-y-auto z-40 shrink-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8D4CC] pb-2.5">
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold text-[#806A55]">
                    Python Block Details
                  </span>
                  <h4 className="text-xs font-bold text-[#171717]">{selectedNode.data?.label}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-[3px] bg-[#171717] text-white font-bold uppercase">
                    {selectedNode.data?.nodeType}
                  </span>
                  <button 
                    className="lg:hidden p-1 rounded hover:bg-black/5 text-[#555]"
                    onClick={() => setIsInspectorOpen(false)}
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#555555] font-bold">PYTHON STATEMENT</label>
                <div className="p-2.5 rounded-[3px] bg-[#F4F1EA] border border-[#D8D4CC] font-mono text-xs text-[#171717]">
                  <code>{selectedNode.data?.pythonCode || selectedNode.data?.label}</code>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#555555] font-bold">EXPLANATION</label>
                <p className="text-xs text-[#555555] leading-relaxed">
                  {selectedNode.data?.explanation || 'Executes this statement in the Python execution order.'}
                </p>
              </div>

              <div className="hidden lg:block space-y-1 pt-2 border-t border-[#D8D4CC]">
                <label className="text-[10px] font-mono text-[#555555] font-bold">NODE POSITION</label>
                <div className="text-[10px] font-mono text-[#555555]">
                  x: {Math.round(selectedNode.position?.x || 0)}, y: {Math.round(selectedNode.position?.y || 0)}
                </div>
              </div>
            </div>

            <div className="hidden lg:block pt-3 border-t border-[#D8D4CC] text-[10px] font-mono text-[#555555] text-center mt-4">
              Click & drag connecting handles to redirect flow
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
