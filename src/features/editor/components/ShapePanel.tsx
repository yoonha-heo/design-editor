import { Circle, Square, Triangle, Diamond } from "lucide-react";

export function ShapePanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
        <button className="flex items-center justify-center w-full h-32 rounded-md p-5 hover:bg-gray-100">
          <Circle size={70} />
        </button>

        <button className="flex items-center justify-center w-full h-32 rounded-md p-5 hover:bg-gray-100">
          <Square size={70} />
        </button>

        <button className="flex items-center justify-center w-full h-32 rounded-md p-5 hover:bg-gray-100">
          <Triangle size={70} />
        </button>

        <button className="flex items-center justify-center w-full h-32 rounded-md p-5 hover:bg-gray-100">
          <Diamond size={70} />
        </button>
      </div>
    </aside>
  );
}
