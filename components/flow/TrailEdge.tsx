import React from "react";
import { getBezierPath, EdgeProps } from "@xyflow/react";

export default function TrailEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeStrokeColor = style.stroke || (selected ? "#F26A3D" : "#171717");
  const strokeWidth = style.strokeWidth || (selected ? 6 : 4);
  const strokeOpacity = style.opacity || 0.8;

  return (
    <>
      {/* Invisible thicker path for easier clicking/selection */}
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />
      {/* Visible dashed trail */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={edgeStrokeColor as string}
        strokeWidth={strokeWidth}
        strokeDasharray="6 6"
        strokeLinecap="round"
        markerEnd={markerEnd}
        style={{
          ...style,
          opacity: strokeOpacity,
          // Optional subtle glow if selected
          filter: selected ? "drop-shadow(0 0 4px rgba(242, 106, 61, 0.4))" : "none",
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          values="12;0"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </>
  );
}
