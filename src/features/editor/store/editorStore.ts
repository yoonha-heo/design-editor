import { create } from "zustand";

import type { EditorElement, EditorTool } from "../types/editor";

interface EditorStore {
  elements: EditorElement[];
  selectedTool: EditorTool;

  setSelectedTool: (tool: EditorTool) => void;
  addRectangleAt: (x: number, y: number) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  elements: [],
  selectedTool: "select",

  setSelectedTool: (tool) => {
    set({ selectedTool: tool });
  },

  addRectangleAt: (x, y) => {
    const newRect: EditorElement = {
      id: crypto.randomUUID(),
      type: "rect",
      x,
      y,
      width: 160,
      height: 120,
      fill: "#3b82f6",
    };

    set((state) => ({
      elements: [...state.elements, newRect],
      selectedTool: "select",
    }));
  },
}));
