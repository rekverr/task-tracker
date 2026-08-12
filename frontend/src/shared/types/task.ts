import type { User } from "./user";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId?: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  deadline?: string | null;
}

export interface TaskHistory {
  id: string;
  oldStatus: TaskStatus | null;
  newStatus: TaskStatus;
  changedAt: string;
  user: User;
}

export interface PaginatedTasks {
  items: Task[];
  meta: { total: number; skip: number; take: number };
}
