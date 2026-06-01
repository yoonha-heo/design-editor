import { create } from "zustand";

import type { EditorElement, ShapeKind } from "../types/editor";

function pushHistory(state: EditorStore) {
  return {
    past: [...state.past, state.elements],
    future: [],
  };
}

interface EditorStore {
  elements: EditorElement[];
  past: EditorElement[][];
  future: EditorElement[][];

  selectedElementId: string | null;

  setSelectedElementId: (id: string | null) => void;

  undo: () => void;
  redo: () => void;

  addShapeAt: (shape: ShapeKind, x: number, y: number) => void;
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
  updateFill: (id: string, fill: string) => void;

  deleteSelectedElement: () => void;

  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  elements: [],
  past: [],
  future: [],

  selectedElementId: null,

  setSelectedElementId: (id) => {
    set({
      selectedElementId: id,
    });
  },

  undo: () => {
    set((state) => {
      const previous = state.past[state.past.length - 1];

      if (!previous) return {};

      return {
        elements: previous,
        past: state.past.slice(0, -1),
        future: [...state.future, state.elements],
        selectedElementId: null,
      };
    });
  },

  redo: () => {
    set((state) => {
      const next = state.future[state.future.length - 1];

      if (!next) return {};

      return {
        elements: next,
        past: [...state.past, state.elements],
        future: state.future.slice(0, -1),
        selectedElementId: null,
      };
    });
  },

  addShapeAt: (shape, x, y) => {
    const newShape: EditorElement = {
      id: crypto.randomUUID(),
      type: "shape",
      shape,
      x,
      y,
      width: 120,
      height: 120,
      fill: "#3b82f6",
      rotation: 0,
    };

    set((state) => ({
      ...pushHistory(state),
      elements: [...state.elements, newShape],
      selectedElementId: newShape.id,
    }));
  },

  updateElementPosition: (id, x, y) => {
    set((state) => ({
      ...pushHistory(state),
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
        ...pushHistory(state),
        elements: state.elements.filter(
          (element) => element.id !== state.selectedElementId,
        ),
        selectedElementId: null,
      };
    });
  },

  updateElementSize: (id, width, height, fontSize?) => {
    set((state) => ({
      ...pushHistory(state),
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
      ...pushHistory(state),
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

  updateFill: (id, fill) => {
    set((state) => ({
      ...pushHistory(state),
      elements: state.elements.map((element) => {
        if (element.id !== id) return element;
        if (element.type === "image") return element;

        return {
          ...element,
          fill,
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
      ...pushHistory(state),
      elements: [...state.elements, newText],
      selectedElementId: newText.id,
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
      ...pushHistory(state),
      elements: [...state.elements, newImage],
      selectedElementId: newImage.id,
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
        ...pushHistory(state),
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
        ...pushHistory(state),
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
        ...pushHistory(state),
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
        ...pushHistory(state),
        elements: next,
      };
    });
  },
}));
