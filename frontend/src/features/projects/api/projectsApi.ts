import { api } from "../../../shared/api/axios";
import type { Project } from "../../../shared/types";

export async function fetchProject(projectId: string) {
  const { data } = await api.get<Project>(`/projects/${projectId}`);
  return data;
}

export async function fetchProjectsByWorkspace(workspaceId: string) {
  const { data } = await api.get<Project[]>(
    `/projects/workspace/${workspaceId}`,
  );
  return data;
}

export async function createProject(name: string, workspaceId: string) {
  const { data } = await api.post<Project>("/projects", { name, workspaceId });
  return data;
}
