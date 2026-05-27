export type EditorTool = "select" | "rect" | "text" | "image";

export type ElementType = "rect" | "text" | "image";

export interface BaseElement {
  id: string;

  type: ElementType;

  width: number;
  height: number;

  x: number;
  y: number;

  rotation: number;
}

export interface RectElement extends BaseElement {
  type: "rect";

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

export type EditorElement = RectElement | TextElement | ImageElement;
