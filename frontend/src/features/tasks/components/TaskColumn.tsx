import { useState } from "react";
import type { Task } from "../../../shared/types";
import type { TaskStatusColumn } from "../constants";
import { TaskCard } from "./TaskCard";

export function TaskColumn({
  column,
  tasks,
  onDrop,
  onOpen,
}: {
  column: TaskStatusColumn;
  tasks: Task[];
  onDrop: (task: Task) => void;
  onOpen: (task: Task) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const raw = e.dataTransfer.getData("task");
        if (raw) onDrop(JSON.parse(raw) as Task);
      }}
      className={`min-h-72 rounded-2xl border p-3 ${
        dragging ? "border-indigo-400 bg-indigo-50" : "bg-slate-100/70"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${column.tone}`}
        >
          {column.label}
        </span>
        <span className="text-sm text-slate-500">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
