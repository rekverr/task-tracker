import { api } from "../../../shared/api/axios";
import type {
  PaginatedTasks,
  Task,
  TaskPriority,
  TaskStatus,
} from "../../../shared/types";

export interface TaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId?: string;
  deadline?: string | null;
}

export type CreateTaskPayload = Omit<TaskPayload, "status"> & {
  status?: TaskStatus;
};

export async function fetchProjectTasks(projectId: string, take = 100) {
  const { data } = await api.get<PaginatedTasks>(
    `/tasks/project/${projectId}?take=${take}`,
  );
  return data;
}

export async function createTask(projectId: string, body: CreateTaskPayload) {
  const { status, deadline, ...rest } = body;
  const payload = {
    ...rest,
    projectId,
    ...(deadline ? { deadline } : {}),
  };
  const { data } = await api.post<Task>("/tasks", payload);
  if (status && status !== data.status) {
    return updateTask(data.id, { status });
  }
  return data;
}

export async function updateTask(taskId: string, body: Partial<TaskPayload>) {
  const { data } = await api.patch<Task>(`/tasks/${taskId}`, body);
  return data;
}

export async function deleteTask(taskId: string) {
  await api.delete(`/tasks/${taskId}`);
}
