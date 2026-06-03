import { useRef, useState } from "react";

import { CanvasArea } from "./CanvasArea";
import { LeftSidebar } from "./LeftSidebar";
import { TopToolbar } from "./TopToolbar";
import { ShapePanel } from "./ShapePanel";
import type Konva from "konva";

export function EditorPage() {
  const [isShapePanelOpen, setIsShapePanelOpen] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);

  const handleDownload = () => {
    const uri = stageRef.current?.toDataURL({
      pixelRatio: 2,
    });

    if (!uri) return;

    const link = document.createElement("a");

    link.download = "design-tool.png";
    link.href = uri;

    link.click();
  };

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
        <TopToolbar handleDownload={handleDownload} />

        <div className="flex flex-1 overflow-auto bg-neutral-100">
          <CanvasArea stageRef={stageRef} />
        </div>
      </div>
    </div>
  );
}
