"use client";

import React, { useState } from "react";
import { X, Folder, FolderCode, FolderArchive, Layers, Star } from "lucide-react";
import posthog from "posthog-js";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, icon: string) => void;
}

const ICONS = [
  { name: "Folder", icon: <Folder size={16} /> },
  { name: "FolderCode", icon: <FolderCode size={16} /> },
  { name: "FolderArchive", icon: <FolderArchive size={16} /> },
  { name: "Layers", icon: <Layers size={16} /> },
  { name: "Star", icon: <Star size={16} /> },
];

export function CreateCollectionModal({ isOpen, onClose, onCreate }: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FolderCode");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), desc.trim(), selectedIcon);
    posthog.capture("collection_created", {
      icon: selectedIcon,
    });
    setName("");
    setDesc("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFFFF] border border-[#171717] rounded-md shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-[#F4F1EA] border-b border-[#D8D4CC]">
          <span className="text-xs font-bold uppercase text-[#171717]">New Collection</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-[#888] hover:text-[#171717]"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Collection Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Game Projects"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#D8D4CC] rounded focus:outline-none focus:border-[#171717]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Icon</label>
            <div className="flex gap-2">
              {ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic.name}
                  onClick={() => setSelectedIcon(ic.name)}
                  className={`p-2 rounded border cursor-pointer flex items-center justify-center transition-colors ${
                    selectedIcon === ic.name
                      ? "border-[#F26A3D] bg-[#F26A3D]/10 text-[#F26A3D]"
                      : "border-[#D8D4CC] bg-transparent text-[#555] hover:bg-[#F4F1EA]"
                  }`}
                  title={ic.name}
                >
                  {ic.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Brief description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#D8D4CC] rounded focus:outline-none focus:border-[#171717]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-[#555] bg-[#F4F1EA] border border-[#D8D4CC] rounded cursor-pointer hover:bg-[#E5E2DA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#F26A3D] hover:bg-[#E0592C] border-none rounded cursor-pointer uppercase transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
