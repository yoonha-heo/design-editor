import type Konva from "konva";
import { Artboard } from "./Artboard";

export function CanvasArea({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage | null>;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100">
      <Artboard stageRef={stageRef} />
    </main>
  );
}
