import { Layer, Rect, Stage, Transformer, Group } from "react-konva";
import { useEffect, useRef } from "react";
import type Konva from "konva";

import { useEditorStore } from "../store/editorStore";
import { useUIStore } from "../store/UIStore";
import type { EditorElement } from "../types/editor";
import { CanvasElement } from "./canvas/CanvasElement";
import { useTextEditing } from "../hooks/useTextEditing";
import { TextEditingOverlay } from "./canvas/TextEditingOverlay";

const ARTBOARD_WIDTH = 500;
const ARTBOARD_HEIGHT = 500;

const ARTBOARD_X = 0;
const ARTBOARD_Y = 0;

export function Artboard({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage | null>;
}) {
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

  const closeFloatingMenus = useUIStore((state) => state.closeFloatingMenus);

  const shapeRef = useRef<any>(null);
  const imageNodeRefs = useRef<Record<string, any>>({});
  const transformerRef = useRef<any>(null);

  const {
    editingId,
    draftText,
    setDraftText,
    textareaRef,
    editingElement,
    startTextEditing,
    finishTextEditing,
  } = useTextEditing({
    elements,
    updateText,
    updateElementSize,
    setSelectedElementId,
  });

  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

  const handleStageMouseDown = (event: any) => {
    const clickedOnEmpty = event.target.name() === "artboard-background";

    if (clickedOnEmpty) {
      closeFloatingMenus();
      setSelectedElementId(null);
    }
  };

  const handleElementDragEnd = (
    elementId: string,
    event: Konva.KonvaEventObject<DragEvent>,
  ) => {
    updateElementPosition(elementId, event.target.x(), event.target.y());
  };

  const handleElementTransformEnd = (
    element: EditorElement,
    event: Konva.KonvaEventObject<Event>,
  ) => {
    const node = event.target;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    const nextWidth = node.width() * scaleX;
    const nextHeight = node.height() * scaleY;

    node.scaleX(1);
    node.scaleY(1);

    if (element.type === "text") {
      const nextFontSize = element.fontSize * scaleX;

      updateElementSize(element.id, nextWidth, nextHeight, nextFontSize);
    } else {
      updateElementSize(element.id, nextWidth, nextHeight);
    }

    updateElementRotation(element.id, rotation);
  };

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

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
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

            {elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                shapeRef={
                  selectedElementId === element.id ? shapeRef : undefined
                }
                editingId={editingId}
                onSelect={setSelectedElementId}
                onStartTextEditing={startTextEditing}
                onDragEnd={handleElementDragEnd}
                onTransformEnd={handleElementTransformEnd}
                onImageReady={handleImageReady}
              />
            ))}
          </Group>

          {selectedElement && (
            <Transformer ref={transformerRef} rotateEnabled keepRatio={true} />
          )}
        </Layer>
      </Stage>

      {editingElement && (
        <TextEditingOverlay
          editingElement={editingElement}
          draftText={draftText}
          textareaRef={textareaRef}
          onChange={setDraftText}
          onFinish={finishTextEditing}
        />
      )}
    </div>
  );
}
