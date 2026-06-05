import { Circle, Square, Triangle, Star } from "lucide-react";
import type { ShapeKind } from "../types/editor";
import type { ReactNode } from "react";

export const SHAPES: Array<{
  kind: ShapeKind;
  icon: ReactNode;
}> = [
  {
    kind: "rectangle",
    icon: <Square size={70} />,
  },
  {
    kind: "circle",
    icon: <Circle size={70} />,
  },
  {
    kind: "triangle",
    icon: <Triangle size={70} />,
  },
  {
    kind: "star",
    icon: <Star size={70} />,
  },
];
