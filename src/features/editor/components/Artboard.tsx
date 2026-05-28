import { Layer, Rect, Stage, Text, Transformer, Image } from "react-konva";
import { useEffect, useRef } from "react";

import { useEditorStore } from "../store/editorStore";
import { useImage } from "../hooks/useImage";

const ARTBOARD_WIDTH = 600;
const ARTBOARD_HEIGHT = 600;

// Image manages its own ref + transformer attach timing
// after the image has finished loading.
function URLImage({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: any) {
  const image = useImage(element.src);
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (!isSelected) return;
    if (!imageRef.current) return;
    if (!transformerRef.current) return;

    transformerRef.current.nodes([imageRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [isSelected, image]);

  if (!image) return null;

  return (
    <>
      <Image
        ref={imageRef}
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />

      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
}

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
  const updateElementRotation = useEditorStore(
    (state) => state.updateElementRotation,
  );
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
                rotation={element.rotation}
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
                  const rotation = node.rotation();

                  const nextWidth = node.width() * scaleX;
                  const nextHeight = node.height() * scaleY;

                  node.scaleX(1);
                  node.scaleY(1);

                  updateElementSize(element.id, nextWidth, nextHeight);
                  updateElementRotation(element.id, rotation);
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
                rotation={element.rotation}
                draggable={selectedElementId === element.id}
                onClick={() => setSelectedElementId(element.id)}
                onDragEnd={(event) => {
                  const node = event.target;

                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();

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
                  updateElementRotation(element.id, rotation);
                }}
              />
            );
          }

          if (element.type === "image") {
            return (
              <URLImage
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => setSelectedElementId(element.id)}
                onDragEnd={(event) => {
                  updateElementPosition(
                    element.id,
                    event.target.x(),
                    event.target.y(),
                  );
                }}
                onTransformEnd={(event) => {
                  const node = event.target;

                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();

                  const nextWidth = node.width() * scaleX;
                  const nextHeight = node.height() * scaleY;

                  node.scaleX(1);
                  node.scaleY(1);

                  updateElementSize(element.id, nextWidth, nextHeight);
                  updateElementRotation(element.id, rotation);
                }}
              />
            );
          }
        })}

        {selectedElement && <Transformer ref={transformerRef} rotateEnabled />}
      </Layer>
    </Stage>
  );
}
