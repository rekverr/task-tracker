import type { TaskPriority } from "../../../shared/types";

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`rounded px-2 py-1 text-[10px] font-bold ${
        priority === "HIGH"
          ? "bg-rose-100 text-rose-700"
          : priority === "MEDIUM"
            ? "bg-amber-100 text-amber-700"
            : "bg-slate-100 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}
