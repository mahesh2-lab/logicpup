"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Play, Check, XCircle, ChevronDown, CheckCheck, HelpCircle } from "lucide-react";
import type { BlockNodeData } from "../ast/types";
import { useEditorStore } from "../state/editorStore";
import { CATEGORY_META } from "./definitions";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (light editorial theme)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  surface:  "#FFFFFF",
  paper:    "#F4F1EA",
  ink:      "#171717",
  inkSec:   "#555555",
  border:   "#D8D4CC",
  brand:    "#F26A3D",
  radius:   "4px",
} as const;

type BlockNodeProps = { id: string; data: BlockNodeData };

// ─────────────────────────────────────────────────────────────────────────────
// Shared handle helpers
// ─────────────────────────────────────────────────────────────────────────────

function FlowIn() {
  return (
    <Handle
      type="target"
      position={Position.Top}
      id="flow-in"
      style={{
        top: -5,
        background: T.surface,
        border: `1.5px solid ${T.border}`,
        width: 10,
        height: 10,
        borderRadius: 2,
      }}
    />
  );
}

function FlowOut() {
  return (
    <Handle
      type="source"
      position={Position.Bottom}
      id="flow-out"
      style={{
        bottom: -5,
        background: T.surface,
        border: `1.5px solid ${T.border}`,
        width: 10,
        height: 10,
        borderRadius: 2,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Block Shell — base wrapper all blocks use
// ─────────────────────────────────────────────────────────────────────────────

function BlockShell({
  data,
  nodeId,
  children,
  minWidth = 200,
}: {
  data: BlockNodeData;
  nodeId?: string;
  children: React.ReactNode;
  minWidth?: number;
}) {
  const { selectedNodeId, openHelp, execution } = useEditorStore();
  const meta = CATEGORY_META[data.category];
  const catColor = meta?.color ?? T.inkSec;

  const isRunning = execution.status === "running";
  const isExecuting = isRunning && execution.executingNodeId === nodeId;
  const isExecuted =
    Boolean(nodeId) &&
    execution.executedNodeIds.includes(nodeId ?? "") &&
    (isRunning || execution.status === "finished");
  const isError = execution.status === "error" && execution.executingNodeId === nodeId;

  let borderColor: string = T.border;
  let borderLeftColor: string = catColor;
  let boxShadow = "0 1px 3px rgba(0, 0, 0, 0.04)";
  let scale = "1";
  let statusBadge: React.ReactNode = null;

  if (isExecuting) {
    borderColor = "#F26A3D";
    borderLeftColor = "#F26A3D";
    boxShadow = "0 0 0 2.5px #F26A3D, 0 0 22px rgba(242, 106, 61, 0.65)";
    scale = "1.02";
    statusBadge = (
      <span
        className="animate-pulse"
        style={{
          fontSize: 9,
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          color: "#FFFFFF",
          background: "#F26A3D",
          padding: "1px 6px",
          borderRadius: 3,
          letterSpacing: "0.05em",
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Play size={8} fill="currentColor" /> RUNNING
      </span>
    );
  } else if (isError) {
    borderColor = "#C94A45";
    borderLeftColor = "#C94A45";
    boxShadow = "0 0 0 3px #C94A45, 0 0 24px rgba(201, 74, 69, 0.7)";
    scale = "1.02";
    statusBadge = (
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          color: "#FFFFFF",
          background: "#C94A45",
          padding: "1px 6px",
          borderRadius: 3,
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <XCircle size={9} /> ERROR
      </span>
    );
  } else if (isExecuted) {
    borderColor = "#287A52";
    borderLeftColor = "#287A52";
    boxShadow = "0 0 0 2px #287A52, 0 0 14px rgba(40, 122, 82, 0.4)";
    statusBadge = (
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          color: "#287A52",
          background: "rgba(40, 122, 82, 0.12)",
          border: "1px solid rgba(40, 122, 82, 0.3)",
          padding: "1px 5px",
          borderRadius: 3,
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Check size={9} strokeWidth={3} /> EXECUTED
      </span>
    );
  }

  return (
    <div
      style={{
        minWidth,
        background: T.surface,
        border: `1px solid ${borderColor}`,
        borderLeft: `3.5px solid ${borderLeftColor}`,
        borderRadius: T.radius,
        fontFamily: "var(--font-sans)",
        position: "relative",
        boxShadow,
        transform: `scale(${scale})`,
        transition: "all 150ms ease-out",
      }}
    >
      {/* Category label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 8px 4px 10px",
          borderBottom: `1px solid ${isExecuted ? "rgba(40,122,82,0.25)" : T.border}`,
          background: isExecuted ? "rgba(40,122,82,0.04)" : isExecuting ? "rgba(242,106,61,0.06)" : "transparent",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isExecuted ? "#287A52" : isExecuting ? "#F26A3D" : catColor,
            }}
          >
            {meta?.label ?? data.category}
          </span>
          {statusBadge}
        </div>
        <button
          type="button"
          onMouseDown={(e) => { e.stopPropagation(); openHelp(data.blockType); }}
          onClick={(e) => { e.stopPropagation(); openHelp(data.blockType); }}
          style={{
            fontSize: 9,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: T.inkSec,
            background: "#FAF9F5",
            border: `1px solid ${T.border}`,
            borderRadius: T.radius,
            padding: "3px 5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 3,
            lineHeight: 1,
            flexShrink: 0,
            transition: "all 120ms ease",
          }}
          className="hover:border-[#F26A3D] hover:text-[#F26A3D] hover:bg-white"
          title="Explain this block (Concept, Terminology & Code Syntax)"
        >
          <HelpCircle size={13} strokeWidth={1.5} />
        </button>
      </div>

      {/* Block body */}
      <div style={{ padding: "8px 12px 10px 12px" }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline text input used inside blocks
// ─────────────────────────────────────────────────────────────────────────────

export function useDefinedVariables(): string[] {
  const nodes = useEditorStore((state) => state.nodes);
  return React.useMemo(() => {
    const vars = new Set<string>();
    for (const node of nodes) {
      const v = node.data.values as Record<string, unknown> | undefined;
      if (!v) continue;
      if (typeof v.name === "string" && v.name.trim()) vars.add(v.name.trim());
      if (typeof v.variableName === "string" && v.variableName.trim()) vars.add(v.variableName.trim());
      if (typeof v.variable === "string" && v.variable.trim()) vars.add(v.variable.trim());
      if (typeof v.target === "string" && v.target.trim()) vars.add(v.target.trim());
    }
    return Array.from(vars);
  }, [nodes]);
}

function BlockInput({
  value,
  onChange,
  placeholder = "",
  width = 72,
  mono = false,
  allowVariables = true,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
  mono?: boolean;
  allowVariables?: boolean;
}) {
  const definedVars = useDefinedVariables();
  const datalistId = React.useId();
  const hasVars = allowVariables && definedVars.length > 0;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <input
        list={hasVars ? datalistId : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: hasVars ? width + 14 : width,
          padding: hasVars ? "2px 18px 2px 6px" : "2px 6px",
          fontSize: 12,
          fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
          color: T.ink,
          background: T.paper,
          border: `1px solid ${T.border}`,
          borderRadius: 4,
          outline: "none",
        }}
      />
      {hasVars && (
        <>
          <datalist id={datalistId}>
            {definedVars.map((v) => (
              <option key={v} value={v}>
                Variable: {v}
              </option>
            ))}
          </datalist>

          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                onChange(e.target.value);
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            title="Pick an existing variable"
            style={{
              position: "absolute",
              right: 2,
              width: 14,
              height: "80%",
              opacity: 0.55,
              cursor: "pointer",
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 10,
            }}
          >
            <option value="" disabled hidden></option>
            <optgroup label="Select Variable">
              {definedVars.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </optgroup>
          </select>
        </>
      )}
    </div>
  );
}

function BlockSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        padding: "2px 4px",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        color: T.ink,
        background: T.paper,
        border: `1px solid ${T.border}`,
        borderRadius: 4,
        outline: "none",
        cursor: "pointer",
      }}
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function BlockRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {children}
    </div>
  );
}

function BlockLabel({ text }: { text: string }) {
  return (
    <span style={{ fontSize: 12, color: T.inkSec, flexShrink: 0 }}>{text}</span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Block implementations
// ─────────────────────────────────────────────────────────────────────────────

export const StartBlock = memo(function StartBlock({ id }: BlockNodeProps) {
  const { execution } = useEditorStore();
  const isRunning = execution.status === "running";
  const isExecuted =
    execution.executedNodeIds.length > 0 &&
    (isRunning || execution.status === "finished");

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${isExecuted ? "#287A52" : T.border}`,
        borderLeft: `3.5px solid ${isExecuted ? "#287A52" : "#555555"}`,
        borderRadius: T.radius,
        padding: "6px 14px 8px",
        minWidth: 160,
        textAlign: "center",
        boxShadow: isExecuted
          ? "0 0 0 2px rgba(40,122,82,0.2), 0 0 12px rgba(40,122,82,0.4)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 150ms ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isExecuted ? "#287A52" : "#555555" }}>
          Start
        </span>
        {isExecuted && (
          <span style={{ fontSize: 9, fontWeight: 700, color: "#287A52", fontFamily: "var(--font-mono)", background: "rgba(40,122,82,0.12)", padding: "1px 5px", borderRadius: 3, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <Check size={9} strokeWidth={3} /> FLOW
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: T.inkSec }}>Program begins here</div>
      <FlowOut />
    </div>
  );
});
StartBlock.displayName = "StartBlock";

export const EndBlock = memo(function EndBlock({ id }: BlockNodeProps) {
  const { execution } = useEditorStore();
  const isFinished = execution.status === "finished" && execution.executedNodeIds.length > 0;

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${isFinished ? "#287A52" : T.border}`,
        borderLeft: `3.5px solid ${isFinished ? "#287A52" : "#555555"}`,
        borderRadius: T.radius,
        padding: "6px 14px 8px",
        minWidth: 160,
        textAlign: "center",
        boxShadow: isFinished
          ? "0 0 0 2px rgba(40,122,82,0.2), 0 0 12px rgba(40,122,82,0.4)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 150ms ease-out",
      }}
    >
      <FlowIn />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isFinished ? "#287A52" : "#555555" }}>
          End
        </span>
        {isFinished && (
          <span style={{ fontSize: 9, fontWeight: 700, color: "#287A52", fontFamily: "var(--font-mono)", background: "rgba(40,122,82,0.12)", padding: "1px 5px", borderRadius: 3, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <CheckCheck size={9} strokeWidth={3} /> COMPLETE
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: T.inkSec }}>Program ends here</div>
    </div>
  );
});
EndBlock.displayName = "EndBlock";

export const SetVariableBlock = memo(function SetVariableBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { name?: string; value?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={250}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="set" />
        <BlockInput value={v.name ?? ""} onChange={(val) => updateNodeValue(id, "name", val)} placeholder="name" width={80} mono />
        <BlockLabel text="=" />
        <BlockInput value={v.value ?? ""} onChange={(val) => updateNodeValue(id, "value", val)} placeholder="value / expr" width={100} mono />
      </BlockRow>
      <FlowOut />
      {/* Expression input socket */}
      <Handle
        type="target"
        position={Position.Left}
        id="val-value"
        title="Connect value / expression"
        style={{ left: -5, top: "50%", background: T.surface, border: `1.5px solid ${T.brand}`, width: 8, height: 8, borderRadius: 2 }}
      />
    </BlockShell>
  );
});
SetVariableBlock.displayName = "SetVariableBlock";

export const ChangeVariableBlock = memo(function ChangeVariableBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { name?: string; delta?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={220}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="change" />
        <BlockInput value={v.name ?? ""} onChange={(val) => updateNodeValue(id, "name", val)} placeholder="name" width={72} mono />
        <BlockLabel text="by" />
        <BlockInput value={v.delta ?? ""} onChange={(val) => updateNodeValue(id, "delta", val)} placeholder="1" width={60} mono />
      </BlockRow>
      <FlowOut />
    </BlockShell>
  );
});
ChangeVariableBlock.displayName = "ChangeVariableBlock";

export const GetVariableBlock = memo(function GetVariableBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { name?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={160}>
      <BlockRow>
        <BlockLabel text="var" />
        <BlockInput value={v.name ?? ""} onChange={(val) => updateNodeValue(id, "name", val)} placeholder="name" width={90} mono />
      </BlockRow>
      <Handle type="source" position={Position.Right} id="expr-out"
        style={{ right: -5, background: T.surface, border: `1.5px solid ${T.border}`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
GetVariableBlock.displayName = "GetVariableBlock";

export const PrintBlock = memo(function PrintBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { message?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={260}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="print(" />
        <BlockInput value={v.message ?? ""} onChange={(val) => updateNodeValue(id, "message", val)} placeholder="message or variable" width={160} mono />
        <BlockLabel text=")" />
      </BlockRow>
      <FlowOut />
      {/* Expression input socket */}
      <Handle
        type="target"
        position={Position.Left}
        id="val-message"
        title="Connect variable or expression to print"
        style={{ left: -5, top: "50%", background: T.surface, border: `1.5px solid #171717`, width: 8, height: 8, borderRadius: 2 }}
      />
    </BlockShell>
  );
});
PrintBlock.displayName = "PrintBlock";

export const AskInputBlock = memo(function AskInputBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { prompt?: string; variableName?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={280}>
      <FlowIn />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <BlockRow>
          <BlockLabel text="ask" />
          <BlockInput
            value={v.prompt ?? ""}
            onChange={(val) => updateNodeValue(id, "prompt", val)}
            placeholder="What is your score?"
            width={180}
            allowVariables={false}
          />
        </BlockRow>
        <BlockRow>
          <BlockLabel text="→ save in" />
          <BlockInput
            value={v.variableName ?? ""}
            onChange={(val) => updateNodeValue(id, "variableName", val)}
            placeholder="score"
            width={90}
            mono
          />
        </BlockRow>
      </div>
      <FlowOut />
    </BlockShell>
  );
});
AskInputBlock.displayName = "AskInputBlock";

export const IfBlock = memo(function IfBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { left?: string; operator?: string; right?: string };
  const ops = ["==", "!=", ">", "<", ">=", "<="];
  return (
    <BlockShell data={data} minWidth={260}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="if" />
        <BlockInput value={v.left ?? ""} onChange={(val) => updateNodeValue(id, "left", val)} placeholder="score" width={76} mono />
        <BlockSelect value={v.operator ?? ">"} onChange={(val) => updateNodeValue(id, "operator", val)} options={ops} />
        <BlockInput value={v.right ?? ""} onChange={(val) => updateNodeValue(id, "right", val)} placeholder="5" width={68} mono />
      </BlockRow>
      <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#287A52" }}>
        <span>TRUE ▶</span>
      </div>
      <FlowOut />
      <Handle
        type="source"
        position={Position.Right}
        id="body-out"
        title="If True (Body)"
        style={{
          right: -5,
          top: "70%",
          background: "#287A52",
          border: `1.5px solid #FFFFFF`,
          boxShadow: "0 0 0 1px #287A52",
          width: 10,
          height: 10,
          borderRadius: 2,
        }}
      />
    </BlockShell>
  );
});
IfBlock.displayName = "IfBlock";

export const IfElseBlock = memo(function IfElseBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { left?: string; operator?: string; right?: string };
  const ops = ["==", "!=", ">", "<", ">=", "<="];
  return (
    <BlockShell data={data} minWidth={280}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="if" />
        <BlockInput value={v.left ?? ""} onChange={(val) => updateNodeValue(id, "left", val)} placeholder="score" width={76} mono />
        <BlockSelect value={v.operator ?? ">"} onChange={(val) => updateNodeValue(id, "operator", val)} options={ops} />
        <BlockInput value={v.right ?? ""} onChange={(val) => updateNodeValue(id, "right", val)} placeholder="5" width={68} mono />
      </BlockRow>
      <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
        <span style={{ color: "#C94A45" }}>◀ ELSE</span>
        <span style={{ color: "#287A52" }}>TRUE ▶</span>
      </div>
      <FlowOut />
      {/* Right handle: TRUE */}
      <Handle
        type="source"
        position={Position.Right}
        id="true-out"
        title="True branch (right)"
        style={{
          right: -5,
          top: "70%",
          background: "#287A52",
          border: `1.5px solid #FFFFFF`,
          boxShadow: "0 0 0 1px #287A52",
          width: 10,
          height: 10,
          borderRadius: 2,
        }}
      />
      {/* Left handle: ELSE */}
      <Handle
        type="source"
        position={Position.Left}
        id="false-out"
        title="Else branch (left)"
        style={{
          left: -5,
          top: "70%",
          background: "#C94A45",
          border: `1.5px solid #FFFFFF`,
          boxShadow: "0 0 0 1px #C94A45",
          width: 10,
          height: 10,
          borderRadius: 2,
        }}
      />
    </BlockShell>
  );
});
IfElseBlock.displayName = "IfElseBlock";

export const RepeatBlock = memo(function RepeatBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { count?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={200}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="repeat" />
        <BlockInput value={v.count ?? ""} onChange={(val) => updateNodeValue(id, "count", val)} placeholder="10" width={52} mono />
        <BlockLabel text="times" />
      </BlockRow>
      <div style={{ marginTop: 6, fontSize: 11, color: "#287A52", fontWeight: 500 }}>→ BODY (connect right)</div>
      <FlowOut />
      <Handle type="source" position={Position.Right} id="body-out"
        style={{ right: -5, top: "50%", background: "#287A52", border: `1.5px solid #287A52`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
RepeatBlock.displayName = "RepeatBlock";

export const WhileBlock = memo(function WhileBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { left?: string; operator?: string; right?: string };
  const ops = ["==", "!=", ">", "<", ">=", "<=", "True", "False"];
  return (
    <BlockShell data={data} nodeId={id} minWidth={240}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="while" />
        <BlockInput value={v.left ?? ""} onChange={(val) => updateNodeValue(id, "left", val)} placeholder="x" width={60} mono />
        <BlockSelect value={v.operator ?? "=="} onChange={(val) => updateNodeValue(id, "operator", val)} options={ops} />
        <BlockInput value={v.right ?? ""} onChange={(val) => updateNodeValue(id, "right", val)} placeholder="0" width={52} mono />
      </BlockRow>
      <div style={{ marginTop: 6, fontSize: 11, color: "#287A52", fontWeight: 500 }}>→ BODY (connect right)</div>
      <FlowOut />
      <Handle type="source" position={Position.Right} id="body-out"
        style={{ right: -5, top: "50%", background: "#287A52", border: `1.5px solid #287A52`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
WhileBlock.displayName = "WhileBlock";

export const ForEachBlock = memo(function ForEachBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { variable?: string; iterable?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={240}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="for" />
        <BlockInput value={v.variable ?? ""} onChange={(val) => updateNodeValue(id, "variable", val)} placeholder="item" width={60} mono />
        <BlockLabel text="in" />
        <BlockInput value={v.iterable ?? ""} onChange={(val) => updateNodeValue(id, "iterable", val)} placeholder="my_list" width={80} mono />
      </BlockRow>
      <div style={{ marginTop: 6, fontSize: 11, color: "#287A52", fontWeight: 500 }}>→ BODY (connect right)</div>
      <FlowOut />
      <Handle type="source" position={Position.Right} id="body-out"
        style={{ right: -5, top: "50%", background: "#287A52", border: `1.5px solid #287A52`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
ForEachBlock.displayName = "ForEachBlock";

export const DefineFunctionBlock = memo(function DefineFunctionBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { name?: string; params?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={240}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="def" />
        <BlockInput value={v.name ?? ""} onChange={(val) => updateNodeValue(id, "name", val)} placeholder="my_fn" width={80} mono />
        <BlockLabel text="(" />
        <BlockInput value={v.params ?? ""} onChange={(val) => updateNodeValue(id, "params", val)} placeholder="a, b" width={80} mono />
        <BlockLabel text="):" />
      </BlockRow>
      <div style={{ marginTop: 6, fontSize: 11, color: T.inkSec, fontWeight: 500 }}>→ BODY (connect right)</div>
      <FlowOut />
      <Handle type="source" position={Position.Right} id="body-out"
        style={{ right: -5, top: "50%", background: T.ink, border: `1.5px solid ${T.ink}`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
DefineFunctionBlock.displayName = "DefineFunctionBlock";

export const CallFunctionBlock = memo(function CallFunctionBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { name?: string; args?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={200}>
      <FlowIn />
      <BlockRow>
        <BlockInput value={v.name ?? ""} onChange={(val) => updateNodeValue(id, "name", val)} placeholder="my_fn" width={80} mono />
        <BlockLabel text="(" />
        <BlockInput value={v.args ?? ""} onChange={(val) => updateNodeValue(id, "args", val)} placeholder="args" width={80} mono />
        <BlockLabel text=")" />
      </BlockRow>
      <FlowOut />
    </BlockShell>
  );
});
CallFunctionBlock.displayName = "CallFunctionBlock";

export const ReturnBlock = memo(function ReturnBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { value?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={180}>
      <FlowIn />
      <BlockRow>
        <BlockLabel text="return" />
        <BlockInput value={v.value ?? ""} onChange={(val) => updateNodeValue(id, "value", val)} placeholder="value" width={88} mono />
      </BlockRow>
      <FlowOut />
    </BlockShell>
  );
});
ReturnBlock.displayName = "ReturnBlock";

export const MathBlock = memo(function MathBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { left?: string; right?: string; target?: string };
  const opMap: Record<string, string> = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
    calculate: "+",
  };
  const op = opMap[data.blockType] ?? "+";
  return (
    <BlockShell data={data} nodeId={id} minWidth={220}>
      <FlowIn />
      <BlockRow>
        <BlockInput
          value={v.target ?? "result"}
          onChange={(val) => updateNodeValue(id, "target", val)}
          placeholder="result"
          width={56}
          mono
        />
        <BlockLabel text="=" />
        <BlockInput
          value={v.left ?? ""}
          onChange={(val) => updateNodeValue(id, "left", val)}
          placeholder="a"
          width={50}
          mono
        />
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "#C94A45", fontWeight: 700 }}>
          {op}
        </span>
        <BlockInput
          value={v.right ?? ""}
          onChange={(val) => updateNodeValue(id, "right", val)}
          placeholder="b"
          width={50}
          mono
        />
      </BlockRow>
      <FlowOut />
      <Handle
        type="source"
        position={Position.Right}
        id="expr-out"
        title="Expression value output"
        style={{
          right: -5,
          top: "50%",
          background: T.surface,
          border: `1.5px solid #C94A45`,
          width: 8,
          height: 8,
          borderRadius: 2,
        }}
      />
    </BlockShell>
  );
});
MathBlock.displayName = "MathBlock";

export const CalculateBlock = memo(function CalculateBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { left?: string; operator?: string; right?: string; target?: string };
  const ops = ["+", "-", "*", "/", "%"];
  return (
    <BlockShell data={data} nodeId={id} minWidth={240}>
      <FlowIn />
      <BlockRow>
        <BlockInput
          value={v.target ?? "result"}
          onChange={(val) => updateNodeValue(id, "target", val)}
          placeholder="result"
          width={56}
          mono
        />
        <BlockLabel text="=" />
        <BlockInput
          value={v.left ?? ""}
          onChange={(val) => updateNodeValue(id, "left", val)}
          placeholder="a"
          width={50}
          mono
        />
        <BlockSelect
          value={v.operator ?? "+"}
          onChange={(val) => updateNodeValue(id, "operator", val)}
          options={ops}
        />
        <BlockInput
          value={v.right ?? ""}
          onChange={(val) => updateNodeValue(id, "right", val)}
          placeholder="b"
          width={50}
          mono
        />
      </BlockRow>
      <FlowOut />
      <Handle
        type="source"
        position={Position.Right}
        id="expr-out"
        title="Expression value output"
        style={{
          right: -5,
          top: "50%",
          background: T.surface,
          border: `1.5px solid #C94A45`,
          width: 8,
          height: 8,
          borderRadius: 2,
        }}
      />
    </BlockShell>
  );
});
CalculateBlock.displayName = "CalculateBlock";

export const ComparisonBlock = memo(function ComparisonBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { left?: string; right?: string };
  const opMap: Record<string, string> = {
    greater_than: ">", less_than: "<", equal: "==",
    not_equal: "!=", greater_equal: ">=", less_equal: "<=",
  };
  const op = opMap[data.blockType] ?? "==";
  return (
    <BlockShell data={data} nodeId={id} minWidth={180}>
      <BlockRow>
        <BlockInput value={v.left ?? ""} onChange={(val) => updateNodeValue(id, "left", val)} placeholder="a" width={52} mono />
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: T.brand }}>{op}</span>
        <BlockInput value={v.right ?? ""} onChange={(val) => updateNodeValue(id, "right", val)} placeholder="b" width={52} mono />
      </BlockRow>
      <Handle type="source" position={Position.Right} id="expr-out"
        style={{ right: -5, background: T.surface, border: `1.5px solid ${T.border}`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
ComparisonBlock.displayName = "ComparisonBlock";

export const BooleanAndBlock = memo(function BooleanAndBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { left?: string; right?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={180}>
      <BlockRow>
        <BlockInput value={v.left ?? ""} onChange={(val) => updateNodeValue(id, "left", val)} placeholder="a" width={52} mono />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#356A9A", fontFamily: "var(--font-mono)" }}>and</span>
        <BlockInput value={v.right ?? ""} onChange={(val) => updateNodeValue(id, "right", val)} placeholder="b" width={52} mono />
      </BlockRow>
      <Handle type="source" position={Position.Right} id="expr-out"
        style={{ right: -5, background: T.surface, border: `1.5px solid ${T.border}`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
BooleanAndBlock.displayName = "BooleanAndBlock";

export const BooleanNotBlock = memo(function BooleanNotBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { value?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={140}>
      <BlockRow>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#356A9A", fontFamily: "var(--font-mono)" }}>not</span>
        <BlockInput value={v.value ?? ""} onChange={(val) => updateNodeValue(id, "value", val)} placeholder="x" width={72} mono />
      </BlockRow>
      <Handle type="source" position={Position.Right} id="expr-out"
        style={{ right: -5, background: T.surface, border: `1.5px solid ${T.border}`, width: 10, height: 10, borderRadius: 2 }} />
    </BlockShell>
  );
});
BooleanNotBlock.displayName = "BooleanNotBlock";

export const ListAddBlock = memo(function ListAddBlock({ id, data }: BlockNodeProps) {
  const { updateNodeValue } = useEditorStore();
  const v = data.values as { list?: string; value?: string };
  return (
    <BlockShell data={data} nodeId={id} minWidth={220}>
      <FlowIn />
      <BlockRow>
        <BlockInput value={v.list ?? ""} onChange={(val) => updateNodeValue(id, "list", val)} placeholder="my_list" width={80} mono />
        <BlockLabel text=".append(" />
        <BlockInput value={v.value ?? ""} onChange={(val) => updateNodeValue(id, "value", val)} placeholder="item" width={64} mono />
        <BlockLabel text=")" />
      </BlockRow>
      <FlowOut />
    </BlockShell>
  );
});
ListAddBlock.displayName = "ListAddBlock";

// ─────────────────────────────────────────────────────────────────────────────
// nodeTypes registry
// ─────────────────────────────────────────────────────────────────────────────

export const nodeTypes: Record<string, React.ComponentType<any>> = {
  startBlock:          StartBlock,
  endBlock:            EndBlock,
  setVariableBlock:    SetVariableBlock,
  changeVariableBlock: ChangeVariableBlock,
  getVariableBlock:    GetVariableBlock,
  printBlock:          PrintBlock,
  askInputBlock:       AskInputBlock,
  ifBlock:             IfBlock,
  ifElseBlock:         IfElseBlock,
  repeatBlock:         RepeatBlock,
  whileBlock:          WhileBlock,
  forEachBlock:        ForEachBlock,
  defineFunctionBlock: DefineFunctionBlock,
  callFunctionBlock:   CallFunctionBlock,
  returnBlock:         ReturnBlock,
  addBlock:            MathBlock,
  subtractBlock:       MathBlock,
  multiplyBlock:       MathBlock,
  divideBlock:         MathBlock,
  calculateBlock:      CalculateBlock,
  greaterThanBlock:    ComparisonBlock,
  lessThanBlock:       ComparisonBlock,
  equalBlock:          ComparisonBlock,
  notEqualBlock:       ComparisonBlock,
  greaterEqualBlock:   ComparisonBlock,
  lessEqualBlock:      ComparisonBlock,
  booleanAndBlock:     BooleanAndBlock,
  booleanNotBlock:     BooleanNotBlock,
  listAddBlock:        ListAddBlock,
};

// Maps blockType → React Flow node type name
export const BLOCK_TYPE_TO_NODE_TYPE: Record<string, string> = {
  start:           "startBlock",
  end:             "endBlock",
  set_variable:    "setVariableBlock",
  change_variable: "changeVariableBlock",
  get_variable:    "getVariableBlock",
  print:           "printBlock",
  ask_input:       "askInputBlock",
  if:              "ifBlock",
  if_else:         "ifElseBlock",
  repeat:          "repeatBlock",
  while:           "whileBlock",
  for_each:        "forEachBlock",
  define_function: "defineFunctionBlock",
  call_function:   "callFunctionBlock",
  return:          "returnBlock",
  add:             "addBlock",
  subtract:        "subtractBlock",
  multiply:        "multiplyBlock",
  divide:          "divideBlock",
  calculate:       "calculateBlock",
  greater_than:    "greaterThanBlock",
  less_than:       "lessThanBlock",
  equal:           "equalBlock",
  not_equal:       "notEqualBlock",
  greater_equal:   "greaterEqualBlock",
  less_equal:      "lessEqualBlock",
  boolean_and:     "booleanAndBlock",
  boolean_not:     "booleanNotBlock",
  list_add:        "listAddBlock",
};
