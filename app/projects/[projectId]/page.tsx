"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MiniLoader } from "@/components/visual-editor/components/MiniLoader";

export default function ProjectIndexPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  useEffect(() => {
    if (projectId) {
      router.replace(`/projects/${projectId}/editor`);
    }
  }, [router, projectId]);

  return <MiniLoader label="Opening workspace…" />;
}
