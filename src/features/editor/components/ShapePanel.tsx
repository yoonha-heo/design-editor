import { useEditorStore } from "../store/editorStore";
import {
  DEFAULT_ELEMENT_X,
  DEFAULT_ELEMENT_Y,
} from "../constants/editorDefaults";
import { SHAPES } from "../constants/shapes";
import type { ShapeKind } from "../types/editor";

export function ShapePanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const addShapeAt = useEditorStore((state) => state.addShapeAt);

  const handleAddShape = (kind: ShapeKind) => {
    addShapeAt(kind, DEFAULT_ELEMENT_X, DEFAULT_ELEMENT_Y);
  };

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
        {SHAPES.map((shape) => (
          <button
            key={shape.kind}
            onClick={() => handleAddShape(shape.kind)}
            className="flex items-center justify-center w-full h-32 rounded-md p-5 hover:bg-gray-100"
          >
            {shape.icon}
          </button>
        ))}
      </div>
    </aside>
  );
}
