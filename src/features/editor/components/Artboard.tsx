import { Layer, Rect, Stage, Text, Transformer } from "react-konva";
import { useEffect, useRef } from "react";

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
  const updateElementSize = useEditorStore((state) => state.updateElementSize);
  const addTextAt = useEditorStore((state) => state.addTextAt);

  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

  useEffect(() => {
    if (selectedElement && shapeRef.current && transformerRef.current) {
      transformerRef.current.nodes([shapeRef.current]);

      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElement]);

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

    const stage = event.target.getStage();
    const pointer = stage?.getPointerPosition();

    if (!pointer) return;

    if (selectedTool === "rect") {
      addRectangleAt(pointer.x, pointer.y);
    }

    if (selectedTool === "text") {
      addTextAt(pointer.x, pointer.y);
    }
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

        {elements.map((element) => {
          if (element.type === "rect") {
            return (
              <Rect
                ref={selectedElementId === element.id ? shapeRef : undefined}
                key={element.id}
                onClick={() => setSelectedElementId(element.id)}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fill={element.fill}
                stroke={
                  selectedElementId === element.id ? "#2563eb" : undefined
                }
                strokeWidth={selectedElementId === element.id ? 2 : 0}
                draggable
                onDragEnd={(event) =>
                  updateElementPosition(
                    element.id,
                    event.target.x(),
                    event.target.y(),
                  )
                }
                onTransformEnd={(event) => {
                  const node = event.target;

                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  const nextWidth = node.width() * scaleX;
                  const nextHeight = node.height() * scaleY;

                  node.scaleX(1);
                  node.scaleY(1);

                  updateElementSize(element.id, nextWidth, nextHeight);
                }}
              />
            );
          }

          if (element.type === "text") {
            return (
              <Text
                key={element.id}
                ref={selectedElementId === element.id ? shapeRef : undefined}
                text={element.text}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fontSize={element.fontSize}
                fill={element.fill}
                draggable={selectedElementId === element.id}
                onClick={() => setSelectedElementId(element.id)}
                onDragEnd={(event) => {
                  const node = event.target;

                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  const nextWidth = node.width() * scaleX;
                  const nextHeight = node.height() * scaleY;
                  const nextFontSize = element.fontSize * scaleX;

                  node.scaleX(1);
                  node.scaleY(1);

                  updateElementSize(
                    element.id,
                    nextWidth,
                    nextHeight,
                    nextFontSize,
                  );
                }}
              />
            );
          }
        })}

        {selectedElement && (
          <Transformer ref={transformerRef} rotateEnabled={false} />
        )}
      </Layer>
    </Stage>
  );
}
