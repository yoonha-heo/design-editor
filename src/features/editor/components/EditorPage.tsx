import { CanvasArea } from "./CanvasArea";
import { LeftSidebar } from "./LeftSidebar";
import { TopToolbar } from "./TopToolbar";

export function EditorPage() {
  return (
    <div className="flex h-screen w-screen bg-neutral-100">
      <LeftSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopToolbar />
        <CanvasArea />
      </div>
    </div>
  );
}
