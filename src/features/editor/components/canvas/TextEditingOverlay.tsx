import type { TextElement } from "../../types/editor";

type TextEditingOverlayProps = {
  editingElement: TextElement;
  draftText: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (text: string) => void;
  onFinish: () => void;
};

export function TextEditingOverlay({
  editingElement,
  draftText,
  textareaRef,
  onChange,
  onFinish,
}: TextEditingOverlayProps) {
  return (
    <textarea
      ref={textareaRef}
      className="absolute z-50 m-0 resize-none overflow-hidden border border-blue-500 bg-transparent p-0 outline-none"
      style={{
        left: editingElement.x,
        top: editingElement.y,
        width: editingElement.width,
        height: editingElement.height,
        fontSize: editingElement.fontSize,
        fontFamily: "Arial",
        fontWeight: "normal",
        color: editingElement.fill,
        lineHeight: "1.2",
        boxSizing: "border-box",
      }}
      value={draftText}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onFinish}
      autoFocus
    />
  );
}
