import { api } from "../../../shared/api/axios";
import type { Workspace } from "../../../shared/types";

export async function fetchWorkspaces() {
  const { data } = await api.get<Workspace[]>("/workspaces");
  return data;
}

export async function fetchWorkspace(workspaceId: string) {
  const { data } = await api.get<Workspace>(`/workspaces/${workspaceId}`);
  return data;
}

export async function createWorkspace(name: string) {
  const { data } = await api.post<Workspace>("/workspaces", { name });
  return data;
}

export async function inviteWorkspaceMember(workspaceId: string, email: string) {
  await api.post(`/workspaces/${workspaceId}/invite`, { email });
}

export async function removeWorkspaceMember(
  workspaceId: string,
  memberUserId: string,
) {
  await api.delete(`/workspaces/${workspaceId}/members/${memberUserId}`);
}
