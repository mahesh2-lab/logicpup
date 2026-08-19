import React from "react";
import { DashboardShell } from "@/components/visual-editor/dashboard/DashboardShell";
import { BlockExplanationModal } from "@/components/visual-editor/components/BlockExplanationModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      {children}
      <BlockExplanationModal />
    </DashboardShell>
  );
}
