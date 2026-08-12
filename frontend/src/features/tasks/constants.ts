import type { TaskPriority, TaskStatus } from "../../shared/types";

export const TASK_STATUSES: {
  value: TaskStatus;
  label: string;
  tone: string;
}[] = [
  { value: "TODO", label: "To do", tone: "bg-slate-100 text-slate-700" },
  {
    value: "IN_PROGRESS",
    label: "In progress",
    tone: "bg-amber-100 text-amber-800",
  },
  { value: "DONE", label: "Done", tone: "bg-emerald-100 text-emerald-800" },
];

export const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

export type TaskStatusColumn = (typeof TASK_STATUSES)[number];
