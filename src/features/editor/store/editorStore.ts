import { create } from "zustand";

import type { EditorElement, EditorTool } from "../types/editor";

interface EditorStore {
  elements: EditorElement[];
  selectedTool: EditorTool;
  selectedElementId: string | null;

  setSelectedTool: (tool: EditorTool) => void;
  setSelectedElementId: (id: string | null) => void;

  addRectangleAt: (x: number, y: number) => void;
  addTextAt: (x: number, y: number) => void;
  addImageAt: (src: string, x: number, y: number) => void;

  updateElementPosition: (id: string, x: number, y: number) => void;
  updateElementSize: (
    id: string,
    width: number,
    height: number,
    fontSize?: number,
  ) => void;
  updateElementRotation: (id: string, rotation: number) => void;

  deleteSelectedElement: () => void;

  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  elements: [],
  selectedTool: "select",
  selectedElementId: null,

  setSelectedTool: (tool) => {
    set({ selectedTool: tool });
  },

  setSelectedElementId: (id) => {
    set({
      selectedElementId: id,
    });
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
      rotation: 0,
    };

    set((state) => ({
      elements: [...state.elements, newRect],
      selectedElementId: newRect.id,
      selectedTool: "select",
    }));
  },

  updateElementPosition: (id, x, y) => {
    set((state) => ({
      elements: state.elements.map((element) => {
        if (element.id !== id) {
          return element;
        }

        return {
          ...element,
          x,
          y,
        };
      }),
    }));
  },

  deleteSelectedElement: () => {
    set((state) => {
      if (!state.selectedElementId) {
        return state;
      }

      return {
        elements: state.elements.filter(
          (element) => element.id !== state.selectedElementId,
        ),
        selectedElementId: null,
      };
    });
  },

  updateElementSize: (id, width, height, fontSize?) => {
    set((state) => ({
      elements: state.elements.map((element) => {
        if (element.id !== id) {
          return element;
        }

        return {
          ...element,
          width,
          height,
          ...(fontSize && { fontSize }),
        };
      }),
    }));
  },

  updateElementRotation: (id, rotation) => {
    set((state) => ({
      elements: state.elements.map((element) => {
        if (element.id !== id) {
          return element;
        }

        return {
          ...element,
          rotation,
        };
      }),
    }));
  },

  addTextAt: (x, y) => {
    const text = "Text";
    const fontSize = 32;

    const newText: EditorElement = {
      id: crypto.randomUUID(),
      type: "text",
      width: text.length * fontSize * 0.6,
      height: fontSize * 1.4,
      x,
      y,
      text,
      fontSize,
      fill: "#111827",
      rotation: 0,
    };

    set((state) => ({
      elements: [...state.elements, newText],
      selectedElementId: newText.id,
      selectedTool: "select",
    }));
  },

  addImageAt: (src, x, y) => {
    const newImage: EditorElement = {
      id: crypto.randomUUID(),
      type: "image",
      src,
      x,
      y,
      width: 240,
      height: 180,
      rotation: 0,
    };

    set((state) => ({
      elements: [...state.elements, newImage],
      selectedElementId: newImage.id,
      selectedTool: "select",
    }));
  },

  bringForward: (id: string) => {
    set((state) => {
      const index = state.elements.findIndex((element) => element.id === id);

      if (index === -1 || index === state.elements.length - 1) {
        return {};
      }

      const next = [...state.elements];

      [next[index], next[index + 1]] = [next[index + 1], next[index]];

      return {
        elements: next,
      };
    });
  },

  bringToFront: (id: string) => {
    set((state) => {
      const index = state.elements.findIndex((element) => element.id === id);

      if (index === -1 || index === state.elements.length - 1) {
        return {};
      }

      const next = [...state.elements];

      const cur = next[index];
      next.splice(index, 1);
      next.push(cur);

      return {
        elements: next,
      };
    });
  },

  sendBackward: (id: string) => {
    set((state) => {
      const index = state.elements.findIndex((element) => element.id === id);

      if (index <= 0) {
        return {};
      }

      const next = [...state.elements];

      [next[index], next[index - 1]] = [next[index - 1], next[index]];

      return {
        elements: next,
      };
    });
  },

  sendToBack: (id: string) => {
    set((state) => {
      const index = state.elements.findIndex((element) => element.id === id);

      if (index <= 0) {
        return {};
      }

      const next = [...state.elements];

      const cur = next[index];
      next.splice(index, 1);
      next.unshift(cur);

      return {
        elements: next,
      };
    });
  },
}));
