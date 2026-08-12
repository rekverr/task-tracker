import { api } from "../../../shared/api/axios";
import type { Comment } from "../../../shared/types";

export async function fetchTaskComments(taskId: string) {
  const { data } = await api.get<Comment[]>(`/comments/task/${taskId}`);
  return data;
}

export async function createComment(taskId: string, text: string) {
  const { data } = await api.post<Comment>("/comments", { taskId, text });
  return data;
}
