import {
  Layer,
  Rect,
  Ellipse,
  RegularPolygon,
  Star,
  Stage,
  Text,
  Transformer,
  Image,
} from "react-konva";
import { useEffect, useRef } from "react";

import { useEditorStore } from "../store/editorStore";
import { useImage } from "../hooks/useImage";

const ARTBOARD_WIDTH = 500;
const ARTBOARD_HEIGHT = 500;


// Image node is created asynchronously
// Notify the parent when the image is ready
// so the Transformer can be attached correctly
function URLImage({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onImageReady,
}: any) {
  const image = useImage(element.src);
  const imageRef = useRef<any>(null);

  useEffect(() => {
    if (!isSelected) return;
    if (!imageRef.current) return;

    onImageReady(element.id, imageRef.current);
  }, [isSelected, image]);

  if (!image) return null;

  return (
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
  );
}

export function Artboard() {
  const elements = useEditorStore((state) => state.elements);
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

  const shapeRef = useRef<any>(null);
  const imageNodeRefs = useRef<Record<string, any>>({});
  const transformerRef = useRef<any>(null);

  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

  const handleImageReady = (id: string, node: any) => {
    imageNodeRefs.current[id] = node;

    if (selectedElementId === id && transformerRef.current) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  };

  useEffect(() => {
    if (!selectedElement || !transformerRef.current) return;

    if (selectedElement.type === "image") {
      const imageNode = imageNodeRefs.current[selectedElement.id];

      if (!imageNode) return;

      transformerRef.current.nodes([imageNode]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }

    if (!shapeRef.current) return;

    transformerRef.current.nodes([shapeRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
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
          if (element.type === "shape") {
            if (element.shape === "rectangle") {
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

            if (element.shape === "circle") {
              return (
                <Ellipse
                  ref={selectedElementId === element.id ? shapeRef : undefined}
                  key={element.id}
                  onClick={() => setSelectedElementId(element.id)}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  radiusX={element.width / 2}
                  radiusY={element.height / 2}
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

            if (element.shape === "triangle") {
              return (
                <RegularPolygon
                  ref={selectedElementId === element.id ? shapeRef : undefined}
                  key={element.id}
                  onClick={() => setSelectedElementId(element.id)}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  sides={3}
                  radius={50}
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

            if (element.shape === "star") {
              return (
                <Star
                  ref={selectedElementId === element.id ? shapeRef : undefined}
                  key={element.id}
                  onClick={() => setSelectedElementId(element.id)}
                  x={element.x}
                  y={element.y}
                  numPoints={5}
                  outerRadius={Math.min(element.width, element.height) * 0.5}
                  innerRadius={Math.min(element.width, element.height) * 0.25}
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
                onImageReady={handleImageReady}
              />
            );
          }
        })}

        {selectedElement && (
          <Transformer ref={transformerRef} rotateEnabled keepRatio={true} />
        )}
      </Layer>
    </Stage>
  );
}
