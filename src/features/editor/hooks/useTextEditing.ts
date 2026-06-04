import { useEffect, useRef, useState } from "react";

import type { EditorElement } from "../types/editor";

type TextElement = Extract<EditorElement, { type: "text" }>;

type UseTextEditingParams = {
  elements: EditorElement[];
  updateText: (id: string, text: string) => void;
  updateElementSize: (
    id: string,
    width: number,
    height: number,
    fontSize?: number,
  ) => void;
  setSelectedElementId: (id: string | null) => void;
};

export function useTextEditing({
  elements,
  updateText,
  updateElementSize,
  setSelectedElementId,
}: UseTextEditingParams) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editingElement = elements.find(
    (element): element is TextElement =>
      element.type === "text" && element.id === editingId,
  );

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;

    textarea.style.width = "auto";
    textarea.style.height = "auto";

    textarea.style.width = `${textarea.scrollWidth}px`;
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [draftText, editingElement]);

  const startTextEditing = (element: TextElement) => {
    setDraftText(element.text);
    setEditingId(element.id);
    setSelectedElementId(null);
  };

  const finishTextEditing = () => {
    if (!editingElement) return;
    if (!textareaRef.current) return;

    updateText(editingElement.id, draftText);

    updateElementSize(
      editingElement.id,
      textareaRef.current.offsetWidth,
      textareaRef.current.offsetHeight,
      editingElement.fontSize,
    );

    setEditingId(null);
  };

  return {
    editingId,
    draftText,
    setDraftText,
    textareaRef,
    editingElement,
    startTextEditing,
    finishTextEditing,
  };
}
