import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Play,
  CheckCircle2,
  Trash2,
  Sliders,
  Code2,
  Terminal,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { CustomNodeData } from './types';

// Standard 4-directional handles matching the screenshot
const NodeHandles: React.FC = () => (
  <>
    {/* Top handle */}
    <Handle
      type="target"
      position={Position.Top}
      id="top"
      className="w-2.5 h-2.5 rounded-full bg-[#171717] border-2 border-white transition-transform hover:scale-150 cursor-crosshair"
    />
    {/* Right handle */}
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="w-2.5 h-2.5 rounded-full bg-[#171717] border-2 border-white transition-transform hover:scale-150 cursor-crosshair"
    />
    {/* Bottom handle */}
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom"
      className="w-2.5 h-2.5 rounded-full bg-[#171717] border-2 border-white transition-transform hover:scale-150 cursor-crosshair"
    />
    {/* Left handle */}
    <Handle
      type="target"
      position={Position.Left}
      id="left"
      className="w-2.5 h-2.5 rounded-full bg-[#171717] border-2 border-white transition-transform hover:scale-150 cursor-crosshair"
    />
  </>
);

// 1. START Node (Matches top node in screenshot)
export const StartNode: React.FC<NodeProps & { data: CustomNodeData }> = memo(({ id, data, selected }) => {
  const isRunning = data.status === 'running' || data.status === 'active';
  const isSuccess = data.status === 'success';

  return (
    <div
      id={`python-node-${id}`}
      className={`relative min-w-[200px] max-w-[240px] px-6 py-3 rounded-[4px] bg-white border border-[#171717] border-l-[5px] border-l-[#171717] shadow-sm transition-all select-none text-center ${
        selected ? 'ring-2 ring-[#F26A3D] shadow-md' : 'hover:shadow-md'
      } ${
        isRunning ? 'ring-2 ring-[#F26A3D] bg-[#FFF8F5]' : isSuccess ? 'border-[#287A52]' : ''
      }`}
    >
      <NodeHandles />
      <div className="space-y-0.5">
        <h3 className="font-extrabold text-xs tracking-wider uppercase text-[#171717]">
          {data.label || 'START'}
        </h3>
        <p className="text-[11px] text-[#555555] font-sans">
          {data.subtitle || 'Program begins here'}
        </p>
      </div>
    </div>
  );
});

// 2. END Node (Matches bottom node in screenshot)
export const EndNode: React.FC<NodeProps & { data: CustomNodeData }> = memo(({ id, data, selected }) => {
  const isRunning = data.status === 'running' || data.status === 'active';
  const isSuccess = data.status === 'success';

  return (
    <div
      id={`python-node-${id}`}
      className={`relative min-w-[200px] max-w-[240px] px-6 py-3 rounded-[4px] bg-white border border-[#171717] border-l-[5px] border-l-[#171717] shadow-sm transition-all select-none text-center ${
        selected ? 'ring-2 ring-[#F26A3D] shadow-md' : 'hover:shadow-md'
      } ${
        isRunning ? 'ring-2 ring-[#F26A3D] bg-[#FFF8F5]' : isSuccess ? 'border-[#287A52]' : ''
      }`}
    >
      <NodeHandles />
      <div className="space-y-0.5">
        <h3 className="font-extrabold text-xs tracking-wider uppercase text-[#171717]">
          {data.label || 'END'}
        </h3>
        <p className="text-[11px] text-[#555555] font-sans">
          {data.subtitle || 'Program ends here'}
        </p>
      </div>
    </div>
  );
});

// 3. Process / Variable Assignment Node (e.g. "Set Secret Number")
export const ProcessNode: React.FC<NodeProps & { data: CustomNodeData }> = memo(({ id, data, selected }) => {
  const isRunning = data.status === 'running' || data.status === 'active';
  const isSuccess = data.status === 'success';

  return (
    <div
      id={`python-node-${id}`}
      className={`relative min-w-[190px] max-w-[230px] px-5 py-3 rounded-[4px] bg-white border border-[#171717] shadow-sm transition-all select-none text-center ${
        selected ? 'ring-2 ring-[#F26A3D] shadow-md' : 'hover:shadow-md'
      } ${
        isRunning ? 'ring-2 ring-[#F26A3D] bg-[#FFF8F5]' : isSuccess ? 'border-[#287A52]' : ''
      }`}
    >
      <NodeHandles />
      <div className="space-y-1">
        <h4 className="font-bold text-xs text-[#171717]">
          {data.label || 'Set Secret Number'}
        </h4>
        {data.pythonCode && (
          <div className="text-[10px] font-mono text-[#555555] bg-[#F4F1EA]/80 px-2 py-0.5 rounded-[2px] truncate">
            <code>{data.pythonCode}</code>
          </div>
        )}
      </div>
    </div>
  );
});

// 4. Input Node (e.g. "Ask for Guess")
export const InputNode: React.FC<NodeProps & { data: CustomNodeData }> = memo(({ id, data, selected }) => {
  const isRunning = data.status === 'running' || data.status === 'active';
  const isSuccess = data.status === 'success';

  return (
    <div
      id={`python-node-${id}`}
      className={`relative min-w-[190px] max-w-[230px] px-5 py-3 rounded-[4px] bg-white border border-[#171717] shadow-sm transition-all select-none text-center ${
        selected ? 'ring-2 ring-[#F26A3D] shadow-md' : 'hover:shadow-md'
      } ${
        isRunning ? 'ring-2 ring-[#F26A3D] bg-[#FFF8F5]' : isSuccess ? 'border-[#287A52]' : ''
      }`}
    >
      <NodeHandles />
      <div className="space-y-1">
        <h4 className="font-bold text-xs text-[#171717]">
          {data.label || 'Ask for Guess'}
        </h4>
        {data.pythonCode && (
          <div className="text-[10px] font-mono text-[#356A9A] bg-[#F4F1EA]/80 px-2 py-0.5 rounded-[2px] truncate">
            <code>{data.pythonCode}</code>
          </div>
        )}
      </div>
    </div>
  );
});

// 5. Condition / Decision Node (e.g. "Check Match")
export const ConditionNode: React.FC<NodeProps & { data: CustomNodeData }> = memo(({ id, data, selected }) => {
  const isRunning = data.status === 'running' || data.status === 'active';
  const isSuccess = data.status === 'success';

  return (
    <div
      id={`python-node-${id}`}
      className={`relative min-w-[190px] max-w-[230px] px-5 py-3 rounded-[4px] bg-white border border-[#171717] shadow-sm transition-all select-none text-center ${
        selected ? 'ring-2 ring-[#F26A3D] shadow-md' : 'hover:shadow-md'
      } ${
        isRunning ? 'ring-2 ring-[#F26A3D] bg-[#FFF8F5]' : isSuccess ? 'border-[#287A52]' : ''
      }`}
    >
      <NodeHandles />
      <div className="space-y-1">
        <h4 className="font-bold text-xs text-[#171717]">
          {data.label || 'Check Match'}
        </h4>
        {data.pythonCode && (
          <div className="text-[10px] font-mono text-[#806A55] bg-[#F4F1EA]/80 px-2 py-0.5 rounded-[2px] truncate">
            <code>{data.pythonCode}</code>
          </div>
        )}
      </div>
    </div>
  );
});

// 6. Output / Print Node (e.g. "Victory Message", "Try Again")
export const OutputNode: React.FC<NodeProps & { data: CustomNodeData }> = memo(({ id, data, selected }) => {
  const isRunning = data.status === 'running' || data.status === 'active';
  const isSuccess = data.status === 'success';

  return (
    <div
      id={`python-node-${id}`}
      className={`relative min-w-[190px] max-w-[230px] px-5 py-3 rounded-[4px] bg-white border border-[#171717] shadow-sm transition-all select-none text-center ${
        selected ? 'ring-2 ring-[#F26A3D] shadow-md' : 'hover:shadow-md'
      } ${
        isRunning ? 'ring-2 ring-[#F26A3D] bg-[#FFF8F5]' : isSuccess ? 'border-[#287A52]' : ''
      }`}
    >
      <NodeHandles />
      <div className="space-y-1">
        <h4 className="font-bold text-xs text-[#171717]">
          {data.label || 'Victory Message'}
        </h4>
        {data.pythonCode && (
          <div className="text-[10px] font-mono text-[#287A52] bg-[#F4F1EA]/80 px-2 py-0.5 rounded-[2px] truncate">
            <code>{data.pythonCode}</code>
          </div>
        )}
      </div>
    </div>
  );
});

export const pythonNodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  input: InputNode,
  condition: ConditionNode,
  output: OutputNode,
  loop: ConditionNode,
};
