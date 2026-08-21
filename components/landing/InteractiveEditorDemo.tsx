import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  Panel,
  MarkerType,
} from '@xyflow/react';
import {
  Play,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Zap,
  Unlock,
  Save,
  FileCode,
  Sparkles,
  Code2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { pythonNodeTypes } from '../flow/CustomNodes';
import { CustomNodeData, PythonNodeType } from '../flow/types';
import { generatePythonFromFlow } from '../flow/CodeGenerator';
import { ReactFlowMobileWarning } from '../ui/ReactFlowMobileWarning';

const PYTHON_CHALLENGE = {
  id: 'ch-py-1',
  title: 'Number Guessing Game (Python Logic)',
  nodes: [
    {
      id: 'n-start',
      type: 'start',
      position: { x: 280, y: 30 },
      data: {
        label: 'START',
        nodeType: 'start' as PythonNodeType,
        subtitle: 'Program begins here',
        pythonCode: '# Program begins here',
        explanation: 'Initializes execution frame.',
        status: 'idle',
      },
    },
    {
      id: 'n-secret',
      type: 'process',
      position: { x: 600, y: 80 },
      data: {
        label: 'Set Secret Number',
        nodeType: 'process' as PythonNodeType,
        subtitle: 'secret_number = 7',
        pythonCode: 'secret_number = 7',
        explanation: 'Assigns target secret integer.',
        status: 'idle',
      },
    },
    {
      id: 'n-guess',
      type: 'input',
      position: { x: 480, y: 240 },
      data: {
        label: 'Ask for Guess',
        nodeType: 'input' as PythonNodeType,
        subtitle: 'guess = int(input())',
        pythonCode: 'guess = int(input("Enter guess: "))',
        explanation: 'Reads user input from terminal.',
        status: 'idle',
      },
    },
    {
      id: 'n-check',
      type: 'condition',
      position: { x: 180, y: 270 },
      data: {
        label: 'Check Match',
        nodeType: 'condition' as PythonNodeType,
        subtitle: 'if guess == secret_number:',
        pythonCode: 'if guess == secret_number:',
        explanation: 'Evaluates branching comparison.',
        status: 'idle',
      },
    },
    {
      id: 'n-victory',
      type: 'output',
      position: { x: 100, y: 440 },
      data: {
        label: 'Victory Message',
        nodeType: 'output' as PythonNodeType,
        subtitle: 'print("Victory! You won!")',
        pythonCode: 'print("🎉 Victory! You won!")',
        explanation: 'Prints congratulations to player.',
        status: 'idle',
      },
    },
    {
      id: 'n-retry',
      type: 'output',
      position: { x: 680, y: 450 },
      data: {
        label: 'Try Again',
        nodeType: 'output' as PythonNodeType,
        subtitle: 'print("Try again")',
        pythonCode: 'print("❌ Wrong guess, try again!")',
        explanation: 'Prompts player to try again.',
        status: 'idle',
      },
    },
    {
      id: 'n-end',
      type: 'end',
      position: { x: 300, y: 560 },
      data: {
        label: 'END',
        nodeType: 'end' as PythonNodeType,
        subtitle: 'Program ends here',
        pythonCode: '# Program ends here',
        explanation: 'Program execution terminates.',
        status: 'idle',
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'n-start',
      target: 'n-secret',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      animated: true,
      style: { stroke: '#171717', strokeWidth: 1.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
    },
    {
      id: 'e2',
      source: 'n-secret',
      target: 'n-guess',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      animated: true,
      style: { stroke: '#171717', strokeWidth: 1.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
    },
    {
      id: 'e3',
      source: 'n-guess',
      target: 'n-check',
      sourceHandle: 'left',
      targetHandle: 'right',
      animated: true,
      style: { stroke: '#171717', strokeWidth: 1.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
    },
    {
      id: 'e4',
      source: 'n-check',
      target: 'n-victory',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      label: 'True (Match)',
      labelStyle: { fill: '#287A52', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
      animated: true,
      style: { stroke: '#287A52', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#287A52' },
    },
    {
      id: 'e5',
      source: 'n-check',
      target: 'n-retry',
      sourceHandle: 'bottom',
      targetHandle: 'left',
      label: 'False (Retry)',
      labelStyle: { fill: '#C94A45', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
      animated: true,
      style: { stroke: '#C94A45', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#C94A45' },
    },
    {
      id: 'e6',
      source: 'n-victory',
      target: 'n-end',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      animated: true,
      style: { stroke: '#171717', strokeWidth: 1.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
    },
    {
      id: 'e7',
      source: 'n-retry',
      target: 'n-end',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      animated: true,
      style: { stroke: '#171717', strokeWidth: 1.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
    },
  ],
};

export const InteractiveEditorDemo: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(PYTHON_CHALLENGE.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(PYTHON_CHALLENGE.edges);

  const [activeNodeId, setActiveNodeId] = useState<string>('n-secret');
  const [testGuessInput, setTestGuessInput] = useState<string>('7');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '>>> Python 3.12 Flowchart Interactive Workspace Ready',
    '>>> Diagram loaded: Number Guessing Game (Match == 7)',
  ]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        animated: true,
        style: { stroke: '#171717', strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
      };
      setEdges((eds) => addEdge(edge as any, eds));
    },
    [setEdges]
  );

  const handleNodeClick = useCallback((_: any, node: any) => {
    setActiveNodeId(node.id);
  }, []);

  const handleRunExecution = () => {
    if (isRunning) return;
    setIsRunning(true);
    const guessNum = parseInt(testGuessInput, 10) || 7;
    const isMatch = guessNum === 7;

    setTerminalLogs([
      '>>> [START] Executing: python main.py',
      '>>> secret_number = 7',
      `>>> user_guess = ${guessNum}`,
      `>>> Evaluating: if (${guessNum} == 7) -> ${isMatch ? 'TRUE' : 'FALSE'}`,
    ]);

    const path = isMatch
      ? ['n-start', 'n-secret', 'n-guess', 'n-check', 'n-victory', 'n-end']
      : ['n-start', 'n-secret', 'n-guess', 'n-check', 'n-retry', 'n-end'];

    let step = 0;
    const interval = setInterval(() => {
      if (step < path.length) {
        const nodeId = path[step];
        setActiveNodeId(nodeId);

        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: {
              ...n.data,
              status: n.id === nodeId ? 'running' : 'idle',
            },
          }))
        );

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
        setHasCompleted(true);

        setTerminalLogs((prev) => [
          ...prev,
          isMatch ? '>>> 🎉 Victory Message: You won!' : '>>> ❌ Try Again Message: Incorrect guess',
          '>>> [END] Program successfully exited (return code: 0)',
        ]);

        if (isMatch) {
          try {
            confetti({
              particleCount: 50,
              spread: 65,
              origin: { y: 0.65 },
              colors: ['#F26A3D', '#287A52', '#356A9A'],
            });
          } catch (e) {}
        }
      }
    }, 450);
  };

  const handleReset = () => {
    setIsRunning(false);
    setNodes(PYTHON_CHALLENGE.nodes);
    setEdges(PYTHON_CHALLENGE.edges);
    setActiveNodeId('n-secret');
    setTerminalLogs([
      '>>> Workspace reset.',
      '>>> Ready for Python flowchart execution.',
    ]);
  };

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];
  const generatedPythonCode = useMemo(() => generatePythonFromFlow(nodes as any, edges), [nodes, edges]);

  return (
    <section
      id="interactive-demo-playground"
      className="hidden lg:block py-16 md:py-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-white border border-[#D8D4CC] text-xs font-mono font-bold text-[#F26A3D] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE PLAYGROUND • SIT, STAY, CODE 🐾</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
            Test-Drive The LogicPup Engine
          </h2>
          <p className="text-base sm:text-lg text-[#555555]">
            Connect blocks, click Run, and watch LogicPup translate your diagram into Python 3 code faster than a retriever chasing a tennis ball.
          </p>
        </div>

        {/* The IDE Container Window */}
        <div className="rounded-sm border border-[#171717]/30 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Top IDE Toolbar */}
          <div className="bg-[#F4F1EA] border-b border-[#D8D4CC] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#171717]/20" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#171717]/20" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#171717]/20" />
              </div>
              <div className="h-3.5 w-[1px] bg-[#D8D4CC] mx-1" />

              {/* Project Title */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#171717] font-semibold">
                <FileCode className="w-3.5 h-3.5 text-[#F26A3D]" />
                <span>guess_game.py (Flowchart)</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-[#287A52]/10 text-[#287A52] font-mono">
                  Python 3.12
                </span>
              </div>
            </div>

            {/* Right: Input test & Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-sm border border-[#D8D4CC] text-xs font-mono">
                <span className="text-[11px] text-[#555555]">guess =</span>
                <input
                  type="number"
                  value={testGuessInput}
                  onChange={(e) => setTestGuessInput(e.target.value)}
                  className="w-10 text-center font-bold text-[#171717] bg-[#F4F1EA] rounded-sm border border-[#D8D4CC] outline-none"
                />
              </div>

              <button
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-sm hover:bg-black/[0.04] text-[#555555] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset Playground"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>

              <button
                id="demo-playground-run-btn"
                onClick={handleRunExecution}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-sm bg-[#F26A3D] hover:bg-[#D9552A] active:scale-95 text-white text-xs font-mono font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Python...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Flowchart</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main IDE Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left 8 Cols: Visual Python Flowchart */}
            <div className="lg:col-span-8 h-[500px] relative">
              <ReactFlowMobileWarning>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={handleNodeClick}
                  nodeTypes={pythonNodeTypes}
                  fitView
                  snapToGrid={true}
                  snapGrid={[20, 20]}
                  defaultEdgeOptions={{
                    animated: true,
                    style: { stroke: '#171717', strokeWidth: 1.8 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#171717' },
                  }}
                  className="bg-[#FAFAFA]"
                >
                  <Background variant={BackgroundVariant.Lines} gap={24} size={1} color="#E2E8F0" />
                  <Controls className="bg-white rounded-sm border border-[#171717]/20 shadow-xs text-[#171717]" />
                  <MiniMap
                    nodeColor="#171717"
                    className="bg-white rounded-sm border border-[#171717]/20 shadow-xs"
                  />

                  <Panel position="bottom-left" className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-sm border border-[#171717]/20 text-[10px] font-mono text-[#555555] shadow-xs flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#F26A3D]" />
                    <span>Click any Python node to inspect statement details</span>
                  </Panel>
                </ReactFlow>
              </ReactFlowMobileWarning>
            </div>

            {/* Right 4 Cols: Inspector & Live Python Code / Terminal */}
            <div className="lg:col-span-4 bg-[#F4F1EA]/40 border-t lg:border-t-0 lg:border-l border-[#D8D4CC] flex flex-col justify-between">
              {/* Python Block Inspector */}
              <div className="p-4 border-b border-[#D8D4CC] space-y-2.5 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#806A55] uppercase">
                    Python Block
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#171717] text-white font-bold uppercase">
                    {activeNode?.data?.nodeType}
                  </span>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-[#171717]">{activeNode?.data?.label}</h5>
                  <p className="text-[11px] text-[#555555]">{activeNode?.data?.subtitle}</p>
                </div>

                <div className="rounded-sm bg-[#F4F1EA] p-2 border border-[#D8D4CC] font-mono text-xs text-[#171717]">
                  <div className="text-[9px] text-[#806A55] mb-0.5 font-bold"># Python Equivalent</div>
                  <code className="text-[#356A9A] text-[11px]">{activeNode?.data?.pythonCode}</code>
                </div>
              </div>

              {/* Real-time Python Console Output */}
              <div className="p-4 bg-[#1E1E1E] text-white flex-1 flex flex-col justify-between font-mono">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-white/50 border-b border-white/10 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#287A52]" /> Python Terminal Output
                    </span>
                    <span className="text-[#4ade80] font-semibold text-[10px]">
                      {isRunning ? 'RUNNING' : hasCompleted ? 'FINISHED' : 'STANDBY'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-white/80 max-h-48 overflow-y-auto">
                    {terminalLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`leading-relaxed text-[11px] ${
                          log.includes('Victory')
                            ? 'text-[#4ade80] font-bold'
                            : log.includes('Wrong')
                            ? 'text-[#f87171] font-bold'
                            : log.includes('[START]')
                            ? 'text-[#60a5fa]'
                            : ''
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                {hasCompleted && (
                  <div className="mt-3 p-2.5 rounded-sm bg-[#287A52]/20 border border-[#287A52]/30 text-xs text-white flex items-center justify-between animate-in fade-in duration-200">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
                      <strong>Python Flow Verified!</strong>
                    </span>
                    <span className="text-[9px] bg-[#4ade80] text-black font-bold px-1.5 py-0.5 rounded-sm">
                      +100 XP
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
