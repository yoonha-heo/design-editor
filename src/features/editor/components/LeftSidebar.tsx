import { Image, MousePointer2, Shapes, Type } from "lucide-react";

import { useEditorStore } from "../store/editorStore";

function SidebarButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
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
  const selectedTool = useEditorStore((state) => state.selectedTool);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);
  const addImageAt = useEditorStore((state) => state.addImageAt);

  return (
    <aside className="z-50 flex w-24 shrink-0 flex-col items-center gap-2 border-r bg-white px-2 py-4">
      <SidebarButton
        icon={<MousePointer2 size={20} />}
        label="Select"
        isActive={selectedTool === "select"}
        onClick={() => setSelectedTool("select")}
      />

      <SidebarButton
        icon={<Shapes size={20} />}
        label="Shapes"
        isActive={isShapePanelOpen}
        onClick={onToggleShapePanel}
      />

      <SidebarButton
        icon={<Type size={22} />}
        label="Text"
        isActive={selectedTool === "text"}
        onClick={() => setSelectedTool("text")}
      />

      <label
        className={`flex h-16 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition-colors ${
          selectedTool === "image"
            ? "bg-emerald-50 text-emerald-600"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Image size={20} />
        <span>Image</span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            const src = URL.createObjectURL(file);

            addImageAt(src, 120, 120);
          }}
        />
      </label>
    </aside>
  );
}
