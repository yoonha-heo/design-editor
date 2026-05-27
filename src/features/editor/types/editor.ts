export type EditorTool = "select" | "rect" | "text";

export type ElementType = "rect" | "text";

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

export type EditorElement = RectElement | TextElement;
