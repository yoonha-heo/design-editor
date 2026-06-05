import { Undo2, Redo2, Download } from "lucide-react";

import { useEditorStore } from "../store/editorStore";
import { ToolbarButton } from "./toolbar/ToolbarButton";
import { ZoomControls } from "./toolbar/ZoomControls";
import { ArrangementMenu } from "./toolbar/ArrangementMenu";
import { ColorPicker } from "./toolbar/ColorPicker";

export function TopToolbar({ handleDownload }: { handleDownload: () => void }) {
  const { undo, redo } = useEditorStore();

  return (
    <header className="flex h-14 items-center justify-end border-b bg-white px-4">
      <div className="relative flex gap-1">
        <ToolbarButton
          icon={<Download size={20} />}
          tooltip="Download"
          onClick={handleDownload}
        />

        <ZoomControls />

        <ColorPicker />

        <ToolbarButton
          icon={<Undo2 size={20} />}
          tooltip="Undo"
          onClick={undo}
        />

        <ToolbarButton
          icon={<Redo2 size={20} />}
          tooltip="Redo"
          onClick={redo}
        />

        <ArrangementMenu />
      </div>
    </header>
  );
}
