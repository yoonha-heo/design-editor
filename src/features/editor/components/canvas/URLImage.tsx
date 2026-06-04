import { useEffect, useRef } from "react";
import type Konva from "konva";
import { Image } from "react-konva";

import { useImage } from "../../hooks/useImage";
import type { EditorElement } from "../../types/editor";

type ImageElement = Extract<EditorElement, { type: "image" }>;

type URLImageProps = {
  element: ImageElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (event: Konva.KonvaEventObject<Event>) => void;
  onImageReady: (id: string, node: Konva.Image) => void;
};

export function URLImage({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onImageReady,
}: URLImageProps) {
  const image = useImage(element.src);
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    if (!isSelected) return;
    if (!imageRef.current) return;

    onImageReady(element.id, imageRef.current);
  }, [element.id, image, isSelected, onImageReady]);

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
      draggable={isSelected}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
}
