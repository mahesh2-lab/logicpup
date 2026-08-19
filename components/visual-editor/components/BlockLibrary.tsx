"use client";

import React, { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import {
  BLOCK_DEFINITIONS,
  CATEGORY_META,
  CATEGORY_ORDER,
} from "../blocks/definitions";
import type { BlockDefinition, BlockCategory } from "../ast/types";
import { useEditorStore } from "../state/editorStore";

// ─────────────────────────────────────────────────────────────────────────────
// Block Library — editorial tool drawer style
// ─────────────────────────────────────────────────────────────────────────────

interface BlockLibraryProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function BlockLibrary({ collapsed, onToggle }: BlockLibraryProps) {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(["variables", "conditions", "loops", "output"]),
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return BLOCK_DEFINITIONS;
    const q = search.toLowerCase();
    return BLOCK_DEFINITIONS.filter(
      (b) =>
        b.label.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q),
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<BlockCategory, BlockDefinition[]>();
    for (const def of filtered) {
      const arr = map.get(def.category) ?? [];
      arr.push(def);
      map.set(def.category, arr);
    }
    return map;
  }, [filtered]);

  function toggleCategory(cat: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function onDragStart(e: React.DragEvent, def: BlockDefinition) {
    e.dataTransfer.setData("application/teachflow-block", def.type);
    e.dataTransfer.effectAllowed = "copy";
  }

  if (collapsed) {
    return (
      <div
        style={{
          width: 32,
          flexShrink: 0,
          borderRight: "1px solid #D8D4CC",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 12,
        }}
      >
        <button
          onClick={onToggle}
          title="Expand block library"
          style={{
            color: "#555",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ChevronRight size={14} />
        </button>
        <span
          style={{
            writingMode: "vertical-rl",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#aaa9a4",
            marginTop: 8,
          }}
        >
          Blocks
        </span>
      </div>
    );
  }

  return (
    <aside
      style={{
        width: 210,
        flexShrink: 0,
        background: "#FFFFFF",
        borderRight: "1px solid #D8D4CC",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          height: 36,
          borderBottom: "1px solid #D8D4CC",
          flexShrink: 0,
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
          Blocks
        </span>
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#555",
          }}
        >
          <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} />
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          padding: "8px 10px",
          borderBottom: "1px solid #D8D4CC",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#F4F1EA",
            border: "1px solid #D8D4CC",
            borderRadius: 4,
            padding: "4px 8px",
          }}
        >
          <Search size={11} color="#aaa9a4" style={{ flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 12,
              color: "#171717",
              fontFamily: "var(--font-sans)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#aaa",
                padding: 0,
              }}
            >
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Palette */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
        {CATEGORY_ORDER.map((cat, catIdx) => {
          const defs = grouped.get(cat as BlockCategory);
          if (!defs || defs.length === 0) return null;
          const meta = CATEGORY_META[cat];
          const isOpen = openCategories.has(cat);

          // Compute display number — first occurrence wins
          const num = meta?.num ?? String(catIdx).padStart(2, "0");

          return (
            <div key={cat}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F4F1EA")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#D8D4CC",
                    minWidth: 18,
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: meta?.color ?? "#555",
                    flex: 1,
                  }}
                >
                  {meta?.label ?? cat}
                </span>
                {isOpen ? (
                  <ChevronDown size={11} color="#aaa" />
                ) : (
                  <ChevronRight size={11} color="#aaa" />
                )}
              </button>

              {/* Block items */}
              {isOpen && (
                <div style={{ paddingBottom: 4 }}>
                  {defs.map((def) => (
                    <BlockPaletteItem
                      key={def.type}
                      def={def}
                      onDragStart={onDragStart}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              padding: "24px 16px",
              color: "#aaa9a4",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            No blocks match "{search}"
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Single palette item ───────────────────────────────────────────────────────

function BlockPaletteItem({
  def,
  onDragStart,
}: {
  def: BlockDefinition;
  onDragStart: (e: React.DragEvent, def: BlockDefinition) => void;
}) {
  const { openHelp } = useEditorStore();
  const catColor = CATEGORY_META[def.category]?.color ?? "#555";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, def)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 12px 5px 20px",
        cursor: "grab",
        borderLeft: "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F4F1EA";
        e.currentTarget.style.borderLeftColor = catColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.borderLeftColor = "transparent";
      }}
      title={def.description}
    >
      <span
        style={{ fontSize: 12, color: "#171717", flex: 1, fontWeight: 500 }}
      >
        {def.label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openHelp(def.type);
        }}
        style={{
          fontSize: 9,
          color: "#555555",
          background: "#FFFFFF",
          border: "1px solid #D8D4CC",
          borderRadius: 3,
          padding: "1px 4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
        }}
        className="hover:border-[#F26A3D] hover:text-[#F26A3D]"
        title={`🔬 Explain "${def.label}" (Concept, Terminology & Syntax)`}
      >
        <span style={{ fontSize: 9 }}>🔬</span>
      </button>
    </div>
  );
}
