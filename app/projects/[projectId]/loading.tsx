import React from "react";
import { MiniLoader } from "@/components/visual-editor/components/MiniLoader";

export default function ProjectLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <MiniLoader label="Loading Workspace Canvas…" />
    </div>
  );
}
