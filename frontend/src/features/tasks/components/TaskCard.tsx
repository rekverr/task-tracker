import type { Task } from "../../../shared/types";
import { PriorityBadge } from "./PriorityBadge";

export function TaskCard({
  task,
  onOpen,
}: {
  task: Task;
  onOpen: (task: Task) => void;
}) {
  return (
    <article
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("task", JSON.stringify(task))
      }
      onClick={() => onOpen(task)}
      className="cursor-grab rounded-xl border bg-white p-4 shadow-sm transition hover:border-indigo-300 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold leading-snug">{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {task.description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{task.assignee?.email || "Unassigned"}</span>
        {task.deadline && (
          <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
        )}
      </div>
    </article>
  );
}
