import type { ReactNode } from "react";

export function ToolbarButton({
  icon,
  tooltip,
  onClick,
}: {
  icon: ReactNode;
  tooltip: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
    >
      {icon}

      <span className="absolute top-10 right-0 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
        <span className="absolute -top-1 right-3 h-2 w-2 rotate-45 bg-black" />
        {tooltip}
      </span>
    </button>
  );
}
