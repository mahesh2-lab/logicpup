"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useViewport,
  useReactFlow,
  type OnConnect,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEditorStore, type BlockNode } from "../state/editorStore";
import { nodeTypes, BLOCK_TYPE_TO_NODE_TYPE } from "../blocks/blockTypes";
import { BLOCK_MAP } from "../blocks/definitions";

// ─────────────────────────────────────────────────────────────────────────────
// Canvas — Editorial Engineering Workspace Canvas
// ─────────────────────────────────────────────────────────────────────────────

export function Canvas() {
  const {
    nodes,
    edges,
    execution,
    onNodesChange,
    onEdgesChange,
    onConnect: storeConnect,
    setSelectedNodeId,
    setExecution,
    addNode,
  } = useEditorStore();

  const onConnect: OnConnect = useCallback(
    (connection) => storeConnect(connection),
    [storeConnect]
  );

  const onNodeClick: NodeMouseHandler<BlockNode> = useCallback(
    (_, node) => setSelectedNodeId(node.id),
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    if (execution.status === "finished" || execution.status === "error") {
      setExecution({
        status: "idle",
        output: execution.output,
        variables: execution.variables,
        executingNodeId: null,
        executedNodeIds: [],
        error: null,
      });
    }
  }, [setSelectedNodeId, setExecution, execution]);

  // Dismiss selection on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedNodeId(null);
        if (execution.status === "finished" || execution.status === "error") {
          setExecution({
            status: "idle",
            output: execution.output,
            variables: execution.variables,
            executingNodeId: null,
            executedNodeIds: [],
            error: null,
          });
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedNodeId, setExecution, execution]);

  // Drag-and-drop from library
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const blockType = e.dataTransfer.getData("application/teachflow-block");
      if (!blockType) return;

      const def = BLOCK_MAP.get(blockType);
      if (!def) return;

      const canvasEl = e.currentTarget as HTMLElement;
      const rect = canvasEl.getBoundingClientRect();

      const x = e.clientX - rect.left - 100;
      const y = e.clientY - rect.top - 40;

      const nodeType = BLOCK_TYPE_TO_NODE_TYPE[blockType];
      const newNode: BlockNode = {
        id: `${blockType}-${Date.now()}`,
        type: nodeType,
        position: { x, y },
        data: {
          blockType,
          label: def.label,
          category: def.category,
          color: def.color,
          icon: def.icon,
          values: { ...def.defaultData },
        },
      };
      addNode(newNode);
    },
    [addNode]
  );

  function handleQuickAdd(blockType: string) {
    const def = BLOCK_MAP.get(blockType);
    if (!def) return;

    const nodeType = BLOCK_TYPE_TO_NODE_TYPE[blockType];
    const newNode: BlockNode = {
      id: `${blockType}-${Date.now()}`,
      type: nodeType,
      position: { x: 230, y: 150 + nodes.length * 90 },
      data: {
        blockType,
        label: def.label,
        category: def.category,
        color: def.color,
        icon: def.icon,
        values: { ...def.defaultData },
      },
    };
    addNode(newNode);
  }

  const isBlankCanvas = nodes.length <= 2;

  // Compute glowing execution path edges
  const renderedEdges = React.useMemo(() => {
    const executedIds = new Set(execution.executedNodeIds);
    const isRunning = execution.status === "running";
    const isFinished = execution.status === "finished";
    const hasExecuted = executedIds.size > 0;

    return edges.map((edge) => {
      const isSourceExecuted = executedIds.has(edge.source);
      const isTargetExecuted = executedIds.has(edge.target);
      const isSourceStart = edge.source.startsWith("start");
      const isTargetEnd = edge.target.startsWith("end");
      const isCurrentlyActive = edge.source === execution.executingNodeId;
      const isPathExecuted =
        (isSourceExecuted || isSourceStart) &&
        (isTargetExecuted || (isTargetEnd && isFinished));

      if (isCurrentlyActive && isRunning) {
        return {
          ...edge,
          animated: true,
          style: {
            stroke: "#F26A3D",
            strokeWidth: 3.5,
            filter: "drop-shadow(0 0 8px rgba(242, 106, 61, 0.85))",
          },
        };
      }

      if (isPathExecuted && (isRunning || isFinished)) {
        return {
          ...edge,
          animated: isRunning,
          style: {
            stroke: "#287A52",
            strokeWidth: 2.5,
            filter: "drop-shadow(0 0 6px rgba(40, 122, 82, 0.65))",
          },
        };
      }

      return {
        ...edge,
        animated: false,
        style: {
          stroke: "#C4C0B6",
          strokeWidth: 1.5,
          opacity: hasExecuted ? 0.35 : 1,
        },
      };
    });
  }, [edges, execution]);

  return (
    <div
      className="flex-1 relative flex flex-col overflow-hidden"
      style={{ background: "#FBFCFF" }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Column Subheader */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          height: 36,
          borderBottom: "1px solid #D8D4CC",
          background: "#FFFFFF",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#171717",
          }}
        >
          PROGRAM CANVAS
        </span>
        <div style={{ fontSize: 10, color: "#888", fontFamily: "var(--font-mono)" }}>
          {nodes.length} BLOCKS ACTIVE
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={renderedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 120, y: 50, zoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          defaultEdgeOptions={{
            style: { stroke: "#A9A59E", strokeWidth: 1.5 },
            animated: false,
          }}
          proOptions={{ hideAttribution: true }}
        >
          {/* Subtle grid pattern */}
          <Background
            variant={BackgroundVariant.Lines}
            gap={16}
            size={1}
            color="#E5E2DA"
          />
          <CanvasZoomBadge />
          <MiniMap
            style={{
              background: "#FFFFFF",
              border: "1px solid #D8D4CC",
              borderRadius: "4px",
              boxShadow: "none",
            }}
            nodeColor={(n) => {
              const data = n.data as { color?: string };
              return data.color ?? "#356A9A";
            }}
            maskColor="rgba(244, 241, 234, 0.6)"
            pannable
            zoomable
          />
        </ReactFlow>

        {/* Empty state & Quick starter chips */}
        {isBlankCanvas && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="bg-[#FFFFFF]/90 border border-[#D8D4CC] p-5 shadow-sm text-center pointer-events-auto"
              style={{ borderRadius: 6, maxWidth: 360 }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#888888",
                  marginBottom: 4,
                }}
              >
                YOUR PROJECT IS READY
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                Start Building With Blocks
              </div>
              <p style={{ fontSize: 12, color: "#555555", lineHeight: 1.4, marginBottom: 12 }}>
                Drag statements from the palette or click below to quickly insert starter logic:
              </p>

              {/* Starter chips */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleQuickAdd("set_variable")}
                  className="text-xs px-2.5 py-1 bg-[#F4F1EA] border border-[#356A9A] text-[#356A9A] rounded font-bold hover:bg-[#356A9A] hover:text-white transition-colors"
                >
                  + Variable
                </button>
                <button
                  onClick={() => handleQuickAdd("ask_input")}
                  className="text-xs px-2.5 py-1 bg-[#F4F1EA] border border-[#171717] text-[#171717] rounded font-bold hover:bg-[#171717] hover:text-white transition-colors"
                >
                  + Input
                </button>
                <button
                  onClick={() => handleQuickAdd("print")}
                  className="text-xs px-2.5 py-1 bg-[#F4F1EA] border border-[#171717] text-[#171717] rounded font-bold hover:bg-[#171717] hover:text-white transition-colors"
                >
                  + Print
                </button>
                <button
                  onClick={() => handleQuickAdd("if_else")}
                  className="text-xs px-2.5 py-1 bg-[#F4F1EA] border border-[#F26A3D] text-[#F26A3D] rounded font-bold hover:bg-[#F26A3D] hover:text-white transition-colors"
                >
                  + If Condition
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Canvas Zoom Badge & Controls
// ─────────────────────────────────────────────────────────────────────────────

function CanvasZoomBadge() {
  const { zoom } = useViewport();
  const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow();
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className="absolute bottom-4 left-4 z-20 flex items-center bg-[#FFFFFF] border border-[#D8D4CC] shadow-xs text-xs font-mono text-[#171717]"
      style={{ borderRadius: 4, overflow: "hidden" }}
    >
      <button
        type="button"
        onClick={() => zoomOut({ duration: 150 })}
        className="px-2.5 py-1 bg-transparent hover:bg-[#F4F1EA] border-none border-r border-[#D8D4CC] cursor-pointer text-[#555] font-bold text-sm select-none transition-colors"
        title="Zoom Out"
      >
        −
      </button>

      <button
        type="button"
        onClick={() => zoomTo(1, { duration: 200 })}
        className="px-2.5 py-1 bg-transparent hover:bg-[#F4F1EA] border-none cursor-pointer font-bold text-[#171717] min-w-13.5 text-center select-none text-[11px] transition-colors"
        title="Reset Zoom to 100%"
      >
        {zoomPercent}%
      </button>

      <button
        type="button"
        onClick={() => zoomIn({ duration: 150 })}
        className="px-2.5 py-1 bg-transparent hover:bg-[#F4F1EA] border-none border-l border-[#D8D4CC] cursor-pointer text-[#555] font-bold text-sm select-none transition-colors"
        title="Zoom In"
      >
        +
      </button>

      <button
        type="button"
        onClick={() => fitView({ padding: 0.25, duration: 250 })}
        className="px-2.5 py-1 bg-transparent hover:bg-[#F4F1EA] border-none border-l border-[#D8D4CC] cursor-pointer text-[#555] text-[10px] font-sans font-bold uppercase select-none transition-colors"
        title="Fit All Blocks to View"
      >
        Fit
      </button>
    </div>
  );
}
