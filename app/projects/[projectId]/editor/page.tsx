"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { BlockLibrary } from "@/components/visual-editor/components/BlockLibrary";
import { Canvas } from "@/components/visual-editor/components/Canvas";
import { CodePanel } from "@/components/visual-editor/components/CodePanel";
import { OutputPanel } from "@/components/visual-editor/components/OutputPanel";
import { InputDialog } from "@/components/visual-editor/components/InputDialog";
import { ChallengeRunnerPanel } from "@/components/visual-editor/components/ChallengeRunnerPanel";
import { useEditorStore } from "@/components/visual-editor/state/editorStore";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";

export default function ProjectEditorPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const { projects } = useProjectsStore();

  const currentProject = projects.find((p) => p.id === projectId);
  const hasLinkedChallenge = Boolean(currentProject?.learningState?.challengeId || currentProject?.learningState?.currentChallenge);

  const {
    layoutMode,
    libraryCollapsed,
    setLibraryCollapsed,
    codeCollapsed,
    setCodeCollapsed,
    taskPanelOpen,
    setTaskPanelOpen,
  } = useEditorStore();

  const [outputExpanded, setOutputExpanded] = useState(true);

  // Automatically open challenge panel on load if this project is a level challenge
  React.useEffect(() => {
    if (hasLinkedChallenge) {
      setTaskPanelOpen(true);
    }
  }, [hasLinkedChallenge, setTaskPanelOpen]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Workspace columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Block Library (Left Tool Drawer) */}
        <BlockLibrary
          collapsed={libraryCollapsed}
          onToggle={() => setLibraryCollapsed(!libraryCollapsed)}
        />

        {/* Center Canvas + Right Code / Challenge Panels */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <Canvas />

            {/* Challenge & Automated Test Cases Panel */}
            {taskPanelOpen && (
              <ChallengeRunnerPanel
                project={currentProject}
                onClose={() => setTaskPanelOpen(false)}
              />
            )}

            {/* Live Python Code Panel */}
            {layoutMode === "split" && !taskPanelOpen && (
              <CodePanel
                collapsed={codeCollapsed}
                onToggle={() => setCodeCollapsed(!codeCollapsed)}
              />
            )}
          </div>

          {/* Terminal Output Panel */}
          <OutputPanel
            expanded={outputExpanded}
            onToggle={() => setOutputExpanded((v) => !v)}
          />
        </div>
      </div>

      {/* Interactive Program Input Dialog */}
      <InputDialog />
    </div>
  );
}
