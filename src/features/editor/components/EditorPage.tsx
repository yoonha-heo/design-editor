import { useState } from "react";

import { CanvasArea } from "./CanvasArea";
import { LeftSidebar } from "./LeftSidebar";
import { TopToolbar } from "./TopToolbar";
import { ShapePanel } from "./ShapePanel";

export function EditorPage() {
  const [isShapePanelOpen, setIsShapePanelOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-neutral-100">
      <LeftSidebar
        isShapePanelOpen={isShapePanelOpen}
        onToggleShapePanel={() => setIsShapePanelOpen((prev) => !prev)}
      />

      <ShapePanel
        isOpen={isShapePanelOpen}
        onClose={() => setIsShapePanelOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopToolbar />
        <CanvasArea />
      </div>
    </div>
  );
}
