import { Layer, Rect, Stage } from "react-konva";
import { useEffect } from "react";

import { useEditorStore } from "../store/editorStore";

const ARTBOARD_WIDTH = 600;
const ARTBOARD_HEIGHT = 600;

export function Artboard() {
  const elements = useEditorStore((state) => state.elements);
  const selectedTool = useEditorStore((state) => state.selectedTool);
  const addRectangleAt = useEditorStore((state) => state.addRectangleAt);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const setSelectedElementId = useEditorStore(
    (state) => state.setSelectedElementId,
  );
  const updateElementPosition = useEditorStore(
    (state) => state.updateElementPosition,
  );
  const deleteSelectedElement = useEditorStore(
    (state) => state.deleteSelectedElement,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") {
        return;
      }

      deleteSelectedElement();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedElement]);

  const handleStageMouseDown = (event: any) => {
    const clickedOnEmpty = event.target.name() === "artboard-background";

    if (clickedOnEmpty) {
      setSelectedElementId(null);
    }

    if (selectedTool !== "rect") return;

    const stage = event.target.getStage();
    const pointer = stage?.getPointerPosition();

    if (!pointer) return;

    addRectangleAt(pointer.x, pointer.y);
  };

  return (
    <Stage
      width={ARTBOARD_WIDTH}
      height={ARTBOARD_HEIGHT}
      onMouseDown={handleStageMouseDown}
    >
      <Layer>
        <Rect
          name="artboard-background"
          x={0}
          y={0}
          width={ARTBOARD_WIDTH}
          height={ARTBOARD_HEIGHT}
          fill="white"
          shadowBlur={16}
          shadowOpacity={0.15}
        />

        {elements.map((element) => (
          <Rect
            key={element.id}
            onClick={() => setSelectedElementId(element.id)}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.fill}
            stroke={selectedElementId === element.id ? "#2563eb" : undefined}
            strokeWidth={selectedElementId === element.id ? 2 : 0}
            draggable
            onDragEnd={(event) =>
              updateElementPosition(
                element.id,
                event.target.x(),
                event.target.y(),
              )
            }
          />
        ))}
      </Layer>
    </Stage>
  );
}
