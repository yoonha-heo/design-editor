import {
  BringToFront,
  SendToBack,
  MoveUp,
  MoveDown,
  Undo2,
  Redo2,
  Palette,
  Minus,
  Plus,
  Download,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";

import { useEditorStore } from "../store/editorStore";
import { useUIStore } from "../store/UIStore";

function ArrangementMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 text-md text-gray-700 hover:text-black"
    >
      <div>{icon}</div>
      <span>{label}</span>
    </div>
  );
}

export function TopToolbar({ handleDownload }: { handleDownload: () => void }) {
  const {
    isArrangementMenuOpen,
    isColorPickerOpen,
    toggleArrangementMenu,
    toggleColorPicker,
  } = useUIStore();

  const {
    elements,
    selectedElementId,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    undo,
    redo,
    updateFill,
    zoom,
    setZoom,
  } = useEditorStore();

  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

  const canChangeFill = selectedElement && selectedElement.type !== "image";

  const handleArrangementAction = (action: (id: string) => void) => {
    if (!selectedElementId) return;

    action(selectedElementId);
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.3));
  };

  return (
    <header className="flex h-14 items-center justify-end border-b bg-white px-4">
      <div className="relative flex gap-1">
        <button
          onClick={handleDownload}
          className="group relative flex w-9 h-9 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <div>
            <Download size={20} />
          </div>
          <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
            <span className="absolute -top-1 right-3 w-2 h-2 rotate-45 bg-black" />
            Download
          </span>
        </button>

        <div className="flex justify-between mx-4">
          <button
            onClick={zoomOut}
            className="group relative flex w-9 h-9 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <div>
              <Minus size={20} />
            </div>
            <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
              <span className="absolute -top-1 right-3 w-2 h-2 rotate-45 bg-black" />
              zoomout
            </span>
          </button>

          <span className="flex w-10 text-center items-center justify-center text-sm font-medium text-neutral-700">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={zoomIn}
            className="group relative flex w-9 h-9 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <div>
              <Plus size={20} />
            </div>
            <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
              <span className="absolute -top-1 right-3 w-2 h-2 rotate-45 bg-black" />
              zoomin
            </span>
          </button>
        </div>

        <button
          onClick={toggleColorPicker}
          className="group relative flex w-9 h-9 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <div>
            <Palette size={20} />
          </div>
          <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
            <span className="absolute -top-1 right-3 w-2 h-2 rotate-45 bg-black" />
            color
          </span>
        </button>

        {isColorPickerOpen && canChangeFill && (
          <div className="absolute top-12 right-0 z-50 rounded-lg bg-white">
            <HexColorPicker
              color={selectedElement.fill}
              onChange={(color) => updateFill(selectedElement.id, color)}
            />
          </div>
        )}

        <button
          onClick={undo}
          className="group relative flex w-9 h-9 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <div>
            <Undo2 size={20} />
          </div>
          <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
            <span className="absolute -top-1 right-3 w-2 h-2 rotate-45 bg-black" />
            undo
          </span>
        </button>

        <button
          onClick={redo}
          className="group relative flex w-9 h-9 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <div>
            <Redo2 size={20} />
          </div>
          <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
            <span className="absolute -top-1 right-3 w-2 h-2 rotate-45 bg-black" />
            redo
          </span>
        </button>

        <button
          onClick={toggleArrangementMenu}
          className="group relative flex w-9 h-9 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <div>
            <BringToFront size={20} />
          </div>
          <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
            <span className="absolute -top-1 right-3 w-2 h-2 rotate-45 bg-black" />
            Arrangement
          </span>
        </button>

        {isArrangementMenuOpen && (
          <div className="absolute right-0 top-12 z-50 w-[300px] rounded-lg bg-white p-4 shadow-lg">
            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
              <ArrangementMenuItem
                icon={<MoveUp size={18} />}
                label="Forward"
                onClick={() => handleArrangementAction(bringForward)}
              />

              <ArrangementMenuItem
                icon={<MoveDown size={18} />}
                label="Backward"
                onClick={() => handleArrangementAction(sendBackward)}
              />

              <ArrangementMenuItem
                icon={<BringToFront size={18} />}
                label="To front"
                onClick={() => handleArrangementAction(bringToFront)}
              />

              <ArrangementMenuItem
                icon={<SendToBack size={18} />}
                label="To back"
                onClick={() => handleArrangementAction(sendToBack)}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
