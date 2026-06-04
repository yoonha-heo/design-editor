import type Konva from "konva";
import { Ellipse, Rect, RegularPolygon, Star, Text } from "react-konva";

import type { EditorElement } from "../../types/editor";
import { URLImage } from "./URLImage";

type CanvasElementProps = {
  element: EditorElement;
  isSelected: boolean;
  shapeRef?: React.RefObject<any>;
  editingId: string | null;

  onSelect: (id: string) => void;
  onDragEnd: (id: string, event: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (
    element: EditorElement,
    event: Konva.KonvaEventObject<Event>,
  ) => void;
  onStartTextEditing: (
    element: Extract<EditorElement, { type: "text" }>,
  ) => void;
  onImageReady: (id: string, node: Konva.Image) => void;
};

export function CanvasElement({
  element,
  isSelected,
  shapeRef,
  editingId,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onStartTextEditing,
  onImageReady,
}: CanvasElementProps) {
  if (element.type === "shape") {
    if (element.shape === "rectangle") {
      return (
        <Rect
          ref={isSelected ? shapeRef : undefined}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          fill={element.fill}
          rotation={element.rotation}
          draggable={isSelected}
          onClick={() => onSelect(element.id)}
          onDragEnd={(event) => onDragEnd(element.id, event)}
          onTransformEnd={(event) => onTransformEnd(element, event)}
        />
      );
    }

    if (element.shape === "circle") {
      return (
        <Ellipse
          ref={isSelected ? shapeRef : undefined}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          radiusX={element.width / 2}
          radiusY={element.height / 2}
          fill={element.fill}
          rotation={element.rotation}
          draggable={isSelected}
          onClick={() => onSelect(element.id)}
          onDragEnd={(event) => onDragEnd(element.id, event)}
          onTransformEnd={(event) => onTransformEnd(element, event)}
        />
      );
    }

    if (element.shape === "triangle") {
      return (
        <RegularPolygon
          ref={isSelected ? shapeRef : undefined}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          sides={3}
          radius={50}
          fill={element.fill}
          rotation={element.rotation}
          draggable={isSelected}
          onClick={() => onSelect(element.id)}
          onDragEnd={(event) => onDragEnd(element.id, event)}
          onTransformEnd={(event) => onTransformEnd(element, event)}
        />
      );
    }

    if (element.shape === "star") {
      return (
        <Star
          ref={isSelected ? shapeRef : undefined}
          x={element.x}
          y={element.y}
          numPoints={5}
          outerRadius={Math.min(element.width, element.height) * 0.5}
          innerRadius={Math.min(element.width, element.height) * 0.25}
          width={element.width}
          height={element.height}
          fill={element.fill}
          rotation={element.rotation}
          draggable={isSelected}
          onClick={() => onSelect(element.id)}
          onDragEnd={(event) => onDragEnd(element.id, event)}
          onTransformEnd={(event) => onTransformEnd(element, event)}
        />
      );
    }
  }

  if (element.type === "text") {
    return (
      <Text
        ref={isSelected ? shapeRef : undefined}
        text={element.text}
        visible={editingId !== element.id}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fontSize={element.fontSize}
        fill={element.fill}
        rotation={element.rotation}
        draggable={isSelected}
        onClick={() => onSelect(element.id)}
        onDblClick={() => onStartTextEditing(element)}
        onDragEnd={(event) => onDragEnd(element.id, event)}
        onTransformEnd={(event) => onTransformEnd(element, event)}
      />
    );
  }

  if (element.type === "image") {
    return (
      <URLImage
        element={element}
        isSelected={isSelected}
        onSelect={() => onSelect(element.id)}
        onDragEnd={(event) => onDragEnd(element.id, event)}
        onTransformEnd={(event) => onTransformEnd(element, event)}
        onImageReady={onImageReady}
      />
    );
  }

  return null;
}
