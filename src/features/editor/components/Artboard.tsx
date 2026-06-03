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
  Group,
} from "react-konva";
import { useEffect, useRef, useState } from "react";

import { useEditorStore } from "../store/editorStore";
import { useUIStore } from "../store/UIStore";
import { useImage } from "../hooks/useImage";
import { ZoomIn } from "lucide-react";

const ARTBOARD_WIDTH = 500;
const ARTBOARD_HEIGHT = 500;

const ARTBOARD_X = 0;
const ARTBOARD_Y = 0;

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
  const updateText = useEditorStore((state) => state.updateText);

  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);

  const closeFloatingMenus = useUIStore((state) => state.closeFloatingMenus);

  const shapeRef = useRef<any>(null);
  const imageNodeRefs = useRef<Record<string, any>>({});
  const transformerRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

  const editingElement = elements.find(
    (element) => element.id === editingId && element.type === "text",
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
      if (editingId) return;

      if (event.key !== "Delete" && event.key !== "Backspace") {
        return;
      }

      deleteSelectedElement();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editingId, deleteSelectedElement]);

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;

    textarea.style.width = "auto";
    textarea.style.height = "auto";

    textarea.style.width = `${textarea.scrollWidth}px`;
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [draftText, editingElement]);

  const handleStageMouseDown = (event: any) => {
    const clickedOnEmpty = event.target.name() === "artboard-background";

    if (clickedOnEmpty) {
      closeFloatingMenus();
      setSelectedElementId(null);
    }
  };

  return (
    <div className="relative">
      <Stage
        width={ARTBOARD_WIDTH * zoom}
        height={ARTBOARD_HEIGHT * zoom}
        onMouseDown={handleStageMouseDown}
      >
        <Layer>
          <Group x={ARTBOARD_X} y={ARTBOARD_Y} scaleX={zoom} scaleY={zoom}>
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
                      ref={
                        selectedElementId === element.id ? shapeRef : undefined
                      }
                      key={element.id}
                      onClick={() => setSelectedElementId(element.id)}
                      x={element.x}
                      y={element.y}
                      width={element.width}
                      height={element.height}
                      fill={element.fill}
                      rotation={element.rotation}
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
                      ref={
                        selectedElementId === element.id ? shapeRef : undefined
                      }
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
                      ref={
                        selectedElementId === element.id ? shapeRef : undefined
                      }
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
                      ref={
                        selectedElementId === element.id ? shapeRef : undefined
                      }
                      key={element.id}
                      onClick={() => setSelectedElementId(element.id)}
                      x={element.x}
                      y={element.y}
                      numPoints={5}
                      outerRadius={
                        Math.min(element.width, element.height) * 0.5
                      }
                      innerRadius={
                        Math.min(element.width, element.height) * 0.25
                      }
                      width={element.width}
                      height={element.height}
                      fill={element.fill}
                      rotation={element.rotation}
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
                    ref={
                      selectedElementId === element.id ? shapeRef : undefined
                    }
                    text={element.text}
                    visible={editingId !== element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fontSize={element.fontSize}
                    fill={element.fill}
                    rotation={element.rotation}
                    draggable={selectedElementId === element.id}
                    onClick={() => setSelectedElementId(element.id)}
                    onDblClick={() => {
                      setDraftText(element.text);
                      setEditingId(element.id);
                      setSelectedElementId(null);
                    }}
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
          </Group>

          {selectedElement && (
            <Transformer ref={transformerRef} rotateEnabled keepRatio={true} />
          )}
        </Layer>
      </Stage>

      {editingElement && editingElement.type === "text" && (
        <textarea
          ref={textareaRef}
          className="absolute z-50 bg-white border border-blue-500 outline-none resize-none overflow-hidden"
          style={{
            left: editingElement.x,
            top: editingElement.y,
            width: editingElement.width,
            height: editingElement.height,
            fontSize: editingElement.fontSize,
            color: editingElement.fill,
            lineHeight: `${editingElement.fontSize * 1.2}px`,
          }}
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onBlur={() => {
            if (!textareaRef.current) return;

            updateText(editingElement.id, draftText);
            updateElementSize(
              editingElement.id,
              textareaRef.current.offsetWidth,
              textareaRef.current.offsetHeight,
              editingElement.fontSize,
            );

            setEditingId(null);
          }}
          autoFocus
        />
      )}
    </div>
  );
}
