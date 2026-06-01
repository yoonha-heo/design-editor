export type ElementType = "shape" | "text" | "image";

export type ShapeKind = "rectangle" | "circle" | "triangle" | "star";

export interface BaseElement {
  id: string;

  type: ElementType;

  width: number;
  height: number;

  x: number;
  y: number;

  rotation: number;
}

export interface ShapeElement extends BaseElement {
  type: "shape";

  shape: ShapeKind;

  fill: string;
}

export interface TextElement extends BaseElement {
  type: "text";

  text: string;

  fontSize: number;

  fill: string;
}

export interface ImageElement extends BaseElement {
  type: "image";

  src: string;
}

export type EditorElement = ShapeElement | TextElement | ImageElement;
