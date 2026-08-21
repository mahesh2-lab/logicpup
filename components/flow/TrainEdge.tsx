import React from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";
import { TrainFront } from "lucide-react";

export default function TrainEdge({
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
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? "#F26A3D" : "#171717",
          opacity: 0.8,
        }}
      />

      {/* Animated Train SVG along the path */}
      <g>
        {/* We use an animateMotion element attached to a group containing our train icon */}
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
        {/* Centering the icon over the path */}
        <g transform="translate(-10, -10)">
          <TrainFront
            width={20}
            height={20}
            className="text-[#F26A3D] drop-shadow-md"
            strokeWidth={2.5}
          />
        </g>
      </g>
    </>
  );
}
