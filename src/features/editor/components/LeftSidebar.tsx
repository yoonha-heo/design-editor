export function LeftSidebar() {
  return (
    <aside className="flex w-20 shrink-0 flex-col items-center gap-3 border-r bg-white p-3">
      <button className="h-10 w-10 rounded-lg border bg-neutral-50 text-sm hover:bg-neutral-100">
        R
      </button>

      <button className="h-10 w-10 rounded-lg border bg-neutral-50 text-sm hover:bg-neutral-100">
        T
      </button>

      <button className="h-10 w-10 rounded-lg border bg-neutral-50 text-sm hover:bg-neutral-100">
        I
      </button>
    </aside>
  );
}
