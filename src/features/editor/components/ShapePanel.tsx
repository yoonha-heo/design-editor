import type { ReactNode } from "react";
import { Circle, Square, Triangle, Star } from "lucide-react";

import { useEditorStore } from "../store/editorStore";
import type { ShapeKind } from "../types/editor";

const DEFAULT_ELEMENT_X = 120;
const DEFAULT_ELEMENT_Y = 120;

const shapes: Array<{
  kind: ShapeKind;
  icon: ReactNode;
}> = [
  { kind: "rectangle", icon: <Square size={70} /> },
  { kind: "circle", icon: <Circle size={70} /> },
  { kind: "triangle", icon: <Triangle size={70} /> },
  { kind: "star", icon: <Star size={70} /> },
];

export function ShapePanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const addShapeAt = useEditorStore((state) => state.addShapeAt);

  return (
    <aside
      className={`flex flex-col shrink-0 bg-white transition-all duration-300 ${isOpen ? "w-[320px] z-50 p-6 border-r" : "w-0 p-0"}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Shapes</h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center h-8 w-8 rounded-sm  p-2 hover:bg-gray-100"
        >
          X
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        {shapes.map((shape) => (
          <button
            key={shape.kind}
            onClick={() =>
              addShapeAt(shape.kind, DEFAULT_ELEMENT_X, DEFAULT_ELEMENT_Y)
            }
            className="flex items-center justify-center w-full h-32 rounded-md p-5 hover:bg-gray-100"
          >
            {shape.icon}
          </button>
        ))}
      </div>
    </aside>
  );
}
