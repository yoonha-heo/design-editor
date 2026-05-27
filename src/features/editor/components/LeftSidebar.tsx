import { useEditorStore } from "../store/editorStore";

export function LeftSidebar() {
  const selectedTool = useEditorStore((state) => state.selectedTool);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);
  const addImageAt = useEditorStore((state) => state.addImageAt);

  return (
    <aside className="flex w-20 shrink-0 flex-col items-center gap-3 border-r bg-white p-3">
      <button
        onClick={() => setSelectedTool("select")}
        className={`h-10 w-10 rounded-xl border text-sm shadow-sm ${selectedTool === "select" ? "bg-neutral-900 text-white" : "bg-white hover:bg-neutral-100"}`}
      >
        V
      </button>

      <button
        onClick={() => setSelectedTool("rect")}
        className={`h-10 w-10 rounded-xl border text-sm shadow-sm ${
          selectedTool === "rect"
            ? "bg-neutral-900 text-white"
            : "bg-white hover:bg-neutral-100"
        }`}
      >
        R
      </button>

      <button
        onClick={() => setSelectedTool("text")}
        className={`h-10 w-10 rounded-xl border text-sm shadow-sm ${
          selectedTool === "text"
            ? "bg-neutral-900 text-white"
            : "bg-white hover:bg-neutral-100"
        }`}
      >
        T
      </button>

      <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border bg-white text-sm shadow-sm hover:bg-neutral-100">
        I
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            const src = URL.createObjectURL(file);

            addImageAt(src, 120, 120);
          }}
        />
      </label>
    </aside>
  );
}
