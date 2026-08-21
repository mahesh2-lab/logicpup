"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StartNode, EndNode, ProcessNode, InputNode, OutputNode, ConditionNode } from './CustomNodes';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Terminal, Code2, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  input: InputNode,
  output: OutputNode,
  condition: ConditionNode,
};

const initialNodes = [
  { id: '1', type: 'start', position: { x: 250, y: 50 }, data: {} },
  { id: '2', type: 'process', position: { x: 250, y: 150 }, data: { code: 'secret = 7' } },
  { id: '3', type: 'input', position: { x: 250, y: 250 }, data: { code: 'guess = int(input())' } },
  { id: '4', type: 'condition', position: { x: 250, y: 350 }, data: { code: 'guess == secret' } },
  { id: '5', type: 'output', position: { x: 450, y: 350 }, data: { code: 'print("Win!")' } },
  { id: '6', type: 'output', position: { x: 250, y: 500 }, data: { code: 'print("Try Again")' } },
  { id: '7', type: 'end', position: { x: 450, y: 450 }, data: {} },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep', animated: false, style: { strokeWidth: 2, stroke: '#171717' } },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep', animated: false, style: { strokeWidth: 2, stroke: '#171717' } },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep', animated: false, style: { strokeWidth: 2, stroke: '#171717' } },
  { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep', animated: false, style: { strokeWidth: 2, stroke: '#287A52' }, label: 'True', labelStyle: { fill: '#287A52', fontWeight: 700 } },
  { id: 'e4-6', source: '4', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep', animated: false, style: { strokeWidth: 2, stroke: '#C94A45' }, label: 'False', labelStyle: { fill: '#C94A45', fontWeight: 700 } },
  { id: 'e5-7', source: '5', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep', animated: false, style: { strokeWidth: 2, stroke: '#171717' } },
  { id: 'e6-3', source: '6', target: '3', sourceHandle: 'left', targetHandle: 'left', type: 'smoothstep', animated: false, style: { strokeWidth: 2, stroke: '#171717' } },
];

export function HeroFlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'console'>('visual');
  const [isRunning, setIsRunning] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [variables, setVariables] = useState<{name: string, value: string}[]>([]);

  // Simulation Steps
  const runSequence = [
    { node: '1', delay: 500, log: 'Program started.' },
    { node: '2', delay: 800, log: 'Assigned secret = 7', vars: [{name: 'secret', value: '7'}] },
    { node: '3', delay: 1200, log: '> Enter guess: 3', vars: [{name: 'guess', value: '3'}] },
    { node: '4', delay: 1000, log: 'Evaluating 3 == 7... False' },
    { node: '6', delay: 800, log: 'Try Again' },
    { node: '3', delay: 1200, log: '> Enter guess: 7', vars: [{name: 'guess', value: '7'}] },
    { node: '4', delay: 1000, log: 'Evaluating 7 == 7... True' },
    { node: '5', delay: 800, log: 'Win!' },
    { node: '7', delay: 500, log: 'Program ended.', win: true },
  ];

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionStep(0);
    setConsoleOutput(['Initializing Python environment...']);
    setVariables([]);
    setActiveTab('visual'); // ensure visual is seen
    
    // Reset edge animations
    setEdges(eds => eds.map(e => ({ ...e, animated: false })));
  };

  useEffect(() => {
    if (!isRunning) return;

    if (executionStep >= runSequence.length) {
      setIsRunning(false);
      return;
    }

    const step = runSequence[executionStep];
    
    // Highlight node
    setNodes(nds => nds.map(n => ({
      ...n,
      selected: n.id === step.node,
      style: {
        ...(n as any).style,
        opacity: (executionStep > 0 && n.id !== step.node) ? 0.5 : 1,
        transform: n.id === step.node ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }
    })));

    // Highlight active edges pointing to this node (simplistic simulation)
    if (executionStep > 0) {
      const prevStep = runSequence[executionStep - 1];
      setEdges(eds => eds.map(e => {
        if (e.source === prevStep.node && e.target === step.node) {
          return { ...e, animated: true, style: { ...(e as any).style, strokeWidth: 3, stroke: '#F26A3D' } };
        }
        return e;
      }));
    }

    const timer = setTimeout(() => {
      if (step.log) setConsoleOutput(prev => [...prev, step.log]);
      if (step.vars) {
        setVariables(prev => {
          const next = [...prev];
          step.vars!.forEach(v => {
            const idx = next.findIndex(n => n.name === v.name);
            if (idx >= 0) next[idx] = v;
            else next.push(v);
          });
          return next;
        });
      }

      if (step.win) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F26A3D', '#287A52', '#356A9A']
        });
      }

      setExecutionStep(prev => prev + 1);
    }, step.delay);

    return () => clearTimeout(timer);
  }, [isRunning, executionStep]);

  // Cleanup on stop
  useEffect(() => {
    if (!isRunning && executionStep > 0) {
      // Reset visuals after 2 seconds of ending
      const t = setTimeout(() => {
        setNodes(nds => nds.map(n => ({ ...n, selected: false, style: { opacity: 1, transform: 'scale(1)' } })));
        setEdges(eds => eds.map(e => ({ ...e, animated: false, style: { ...e.style, strokeWidth: 2, stroke: e.id === 'e4-5' ? '#287A52' : e.id === 'e4-6' ? '#C94A45' : '#171717' } })));
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isRunning]);

  const generatedCode = `# Generated from Visual Flowchart
secret = 7

while True:
    guess = int(input("Enter guess: "))
    if guess == secret:
        print("Win!")
        break
    else:
        print("Try Again")
`;

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-2xl border border-[#D8D4CC] overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F4F1EA] border-b border-[#D8D4CC]">
        <div className="flex bg-[#E2E8F0] p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'visual' ? 'bg-white text-[#171717] shadow-sm' : 'text-[#555555] hover:text-[#171717]'}`}
          >
            <Network size={14} /> Flowchart
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'code' ? 'bg-white text-[#171717] shadow-sm' : 'text-[#555555] hover:text-[#171717]'}`}
          >
            <Code2 size={14} /> Python 3
          </button>
          <button 
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'console' ? 'bg-white text-[#171717] shadow-sm' : 'text-[#555555] hover:text-[#171717]'}`}
          >
            <Terminal size={14} /> Console
            {consoleOutput.length > 0 && <span className="bg-[#F26A3D] text-white text-[10px] px-1.5 rounded-full">{consoleOutput.length}</span>}
          </button>
        </div>
        
        <div>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 bg-[#287A52] text-white px-4 py-1.5 rounded-md text-xs font-bold shadow-sm hover:bg-[#1E5C3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? <RotateCcw size={14} className="animate-spin" /> : <Play size={14} />}
            {isRunning ? "Running..." : "Run Flow"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-[#F8F6F1]">
        
        {/* Flowchart View */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'visual' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            panOnScroll={false}
            zoomOnScroll={false}
            nodesDraggable={false}
            nodesConnectable={false}
          >
            <Background color="#D8D4CC" gap={16} />
          </ReactFlow>
        </div>

        {/* Code View */}
        <div className={`absolute inset-0 bg-[#171717] p-6 overflow-auto transition-opacity duration-300 ${activeTab === 'code' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <pre className="font-mono text-sm text-[#E2E8F0] whitespace-pre-wrap">
            <code dangerouslySetInnerHTML={{ __html: generatedCode.replace(/print|if|else|while|True|break|int|input/g, match => `<span class="text-[#F26A3D]">${match}</span>`).replace(/"[^"]*"/g, match => `<span class="text-[#287A52]">${match}</span>`) }}>
            </code>
          </pre>
        </div>

        {/* Console View */}
        <div className={`absolute inset-0 bg-[#171717] flex flex-col md:flex-row transition-opacity duration-300 ${activeTab === 'console' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto">
            <div className="text-[#888888] mb-2">LogicPup Python Console v1.4 🐾</div>
            {consoleOutput.map((line, i) => (
              <div key={i} className={line.startsWith('>') ? 'text-[#356A9A]' : line.includes('Error') ? 'text-[#C94A45]' : 'text-white'}>
                {line}
              </div>
            ))}
            {isRunning && <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 h-4 bg-white ml-1 align-middle"></motion.div>}
          </div>
          
          {/* Variables Watch */}
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-[#333333] bg-[#262626] p-4 flex flex-col">
            <div className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-4">Variables Watch</div>
            <div className="space-y-2">
              <AnimatePresence>
                {variables.length === 0 && (
                  <div className="text-xs text-[#555555]">No variables initialized.</div>
                )}
                {variables.map(v => (
                  <motion.div 
                    key={v.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center bg-[#171717] px-3 py-2 rounded border border-[#333333]"
                  >
                    <span className="font-mono text-xs text-[#356A9A]">{v.name}</span>
                    <span className="font-mono text-xs text-[#287A52] font-bold">{v.value}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
