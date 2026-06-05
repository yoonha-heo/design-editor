import { Minus, Plus } from "lucide-react";

import { useEditorStore } from "../../store/editorStore";
import { ToolbarButton } from "./ToolbarButton";

export function ZoomControls() {
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);

  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.3));
  };

  return (
    <div className="mx-4 flex items-center">
      <ToolbarButton
        icon={<Minus size={20} />}
        tooltip="Zoom Out"
        onClick={zoomOut}
      />

      <span className="flex w-10 items-center justify-center text-sm font-medium text-neutral-700">
        {Math.round(zoom * 100)}%
      </span>

      <ToolbarButton
        icon={<Plus size={20} />}
        tooltip="Zoom In"
        onClick={zoomIn}
      />
    </div>
  );
}
