"use client";

import { useState, useEffect } from "react";

/**
 * Hook to avoid hydration mismatch by ensuring client-dependent
 * or localStorage-persisted state only renders after initial client mount.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
