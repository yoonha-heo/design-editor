import type { ReactNode } from "react";
import { Shapes, Type } from "lucide-react";

import { useEditorStore } from "../store/editorStore";
import {
  DEFAULT_ELEMENT_X,
  DEFAULT_ELEMENT_Y,
} from "../constants/editorDefaults";
import { ImageUploadButton } from "./sidebar/ImageUploadButton";

function SidebarButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-16 w-20 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition-colors ${
        isActive
          ? "bg-emerald-50 text-emerald-600"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function LeftSidebar({
  isShapePanelOpen,
  onToggleShapePanel,
}: {
  isShapePanelOpen: boolean;
  onToggleShapePanel: () => void;
}) {
  const addTextAt = useEditorStore((state) => state.addTextAt);

  const handleAddText = () => {
    addTextAt(DEFAULT_ELEMENT_X, DEFAULT_ELEMENT_Y);
  };

  return (
    <aside className="z-50 flex w-24 shrink-0 flex-col items-center gap-2 border-r bg-white px-2 py-4">
      <SidebarButton
        icon={<Shapes size={20} />}
        label="Shapes"
        isActive={isShapePanelOpen}
        onClick={onToggleShapePanel}
      />

      <SidebarButton
        icon={<Type size={22} />}
        label="Text"
        onClick={handleAddText}
      />

      <ImageUploadButton />
    </aside>
  );
}
