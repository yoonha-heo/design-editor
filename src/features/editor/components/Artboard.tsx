import { Layer, Rect, Stage } from "react-konva";

import { useEditorStore } from "../store/editorStore";

const ARTBOARD_WIDTH = 600;
const ARTBOARD_HEIGHT = 600;

export function Artboard() {
  const elements = useEditorStore((state) => state.elements);
  const selectedTool = useEditorStore((state) => state.selectedTool);
  const addRectangleAt = useEditorStore((state) => state.addRectangleAt);

  const handleStageClick = (event: any) => {
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
      onMouseDown={handleStageClick}
    >
      <Layer>
        <Rect
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
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.fill}
          />
        ))}
      </Layer>
    </Stage>
  );
}
