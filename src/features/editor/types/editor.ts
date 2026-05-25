export type EditorTool = "select" | "rect";

export type ElementType = "rect";

export interface EditorElement {
  id: string;
  type: ElementType;

  x: number;
  y: number;

  width: number;
  height: number;

  fill: string;
}
