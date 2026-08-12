import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, fetchProjectsByWorkspace } from "../../features/projects";
import {
  fetchWorkspace,
  inviteWorkspaceMember,
  removeWorkspaceMember,
} from "../../features/workspaces";
import { useAppSelector } from "../../shared/hooks/redux";
import { getApiErrorMessage } from "../../shared/lib/api-error";
import type { Project, Workspace } from "../../shared/types";
import { Empty, Loader, StateError } from "../../shared/ui";
import { AppShell } from "../../widgets/layout";

export function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((s) => s.auth.user);
  const isOwner = workspace?.ownerId === user?.id;

  const load = async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError("");
    try {
      const [workspaceData, projectData] = await Promise.all([
        fetchWorkspace(workspaceId),
        fetchProjectsByWorkspace(workspaceId),
      ]);
      setWorkspace(workspaceData);
      setProjects(projectData);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [workspaceId]);

  const handleCreateProject = async (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceId) return;
    try {
      const data = await createProject(projectName, workspaceId);
      setProjects((items) => [data, ...items]);
      setProjectName("");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const invite = async (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceId) return;
    try {
      await inviteWorkspaceMember(workspaceId, inviteEmail);
      setInviteEmail("");
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const removeMember = async (id: string) => {
    if (!workspaceId || !confirm("Remove this member?")) return;
    try {
      await removeWorkspaceMember(workspaceId, id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        <button
          className="mb-5 text-sm font-semibold text-indigo-600"
          onClick={() => navigate("/")}
        >
          ← All workspaces
        </button>
        {loading ? (
          <Loader />
        ) : error ? (
          <StateError error={error} retry={load} />
        ) : (
          workspace && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">WORKSPACE</p>
                  <h1 className="page-title">{workspace.name}</h1>
                  <p className="subtitle">
                    {workspace.members?.length || 0} team member(s)
                  </p>
                </div>
                <form className="flex gap-2" onSubmit={handleCreateProject}>
                  <input
                    className="input"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="New project name"
                  />
                  <button className="btn">+ Project</button>
                </form>
              </div>
              <section className="mt-9">
                <h2 className="section-title">Projects</h2>
                {projects.length ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                      <button
                        className="card text-left hover:border-indigo-300"
                        key={project.id}
                        onClick={() =>
                          navigate(`/projects/${project.id}`, {
                            state: { workspace },
                          })
                        }
                      >
                        <p className="font-bold">{project.name}</p>
                        <p className="mt-5 text-sm text-indigo-600">
                          Open board →
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <Empty
                    title="No projects yet"
                    text="Create a project to add tasks and build a board."
                  />
                )}
              </section>
              {isOwner && (
                <section className="mt-10 rounded-2xl border bg-white p-5">
                  <h2 className="section-title">Team members</h2>
                  <form className="mt-4 flex max-w-lg gap-2" onSubmit={invite}>
                    <input
                      className="input"
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Registered user email"
                    />
                    <button className="btn">Invite</button>
                  </form>
                  <div className="mt-5 divide-y">
                    {workspace.members?.map((member) => (
                      <div
                        className="flex items-center justify-between py-3"
                        key={member.id}
                      >
                        <div>
                          <p className="font-medium">{member.user.email}</p>
                          <p className="text-xs text-slate-500">
                            {member.role}
                          </p>
                        </div>
                        {member.role !== "OWNER" && (
                          <button
                            className="text-sm font-semibold text-rose-600"
                            onClick={() => removeMember(member.userId)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )
        )}
      </main>
    </AppShell>
  );
}
