import { useRef, useState } from "react";
import type Konva from "konva";

import { CanvasArea } from "./CanvasArea";
import { LeftSidebar } from "./LeftSidebar";
import { TopToolbar } from "./TopToolbar";
import { ShapePanel } from "./ShapePanel";

export function EditorPage() {
  const [isShapePanelOpen, setIsShapePanelOpen] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);

  const closeShapePanel = () => {
    setIsShapePanelOpen(false);
  };

  const toggleShapePanel = () => {
    setIsShapePanelOpen((prev) => !prev);
  };

  const handleDownload = () => {
    const uri = stageRef.current?.toDataURL({
      pixelRatio: 2,
    });

    if (!uri) return;

    const link = document.createElement("a");

    link.download = "canvas-export.png";
    link.href = uri;

    link.click();
  };

  return (
    <div className="flex h-screen w-screen bg-neutral-100">
      <LeftSidebar
        isShapePanelOpen={isShapePanelOpen}
        onToggleShapePanel={toggleShapePanel}
      />

      <ShapePanel isOpen={isShapePanelOpen} onClose={closeShapePanel} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopToolbar handleDownload={handleDownload} />

        <div className="flex flex-1 overflow-auto bg-neutral-100">
          <CanvasArea stageRef={stageRef} />
        </div>
      </div>
    </div>
  );
}
