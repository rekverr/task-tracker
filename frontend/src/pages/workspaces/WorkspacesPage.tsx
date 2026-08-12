import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createWorkspace,
  fetchWorkspaces,
} from "../../features/workspaces";
import { getApiErrorMessage } from "../../shared/lib/api-error";
import type { Workspace } from "../../shared/types";
import { Empty, Loader, StateError } from "../../shared/ui";
import { AppShell } from "../../widgets/layout";

export function WorkspacesPage() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setWorkspaces(await fetchWorkspaces());
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const data = await createWorkspace(name);
      setName("");
      navigate(`/workspaces/${data.id}`);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">YOUR WORK</p>
            <h1 className="page-title">Workspaces</h1>
            <p className="subtitle">
              Keep projects and team tasks in one place.
            </p>
          </div>
          <form onSubmit={create} className="flex w-full gap-2 sm:w-auto">
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder="New workspace name"
            />
            <button className="btn" disabled={creating}>
              {creating ? "Creating…" : "+ Workspace"}
            </button>
          </form>
        </div>
        {error && <StateError error={error} retry={load} />}
        {loading ? (
          <Loader />
        ) : (
          !error &&
          (workspaces.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <button
                  className="card text-left hover:border-indigo-300"
                  key={workspace.id}
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                >
                  <p className="text-lg font-bold">{workspace.name}</p>
                  <p className="mt-5 text-sm text-slate-500">
                    Owner: {workspace.owner?.email || "You"}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <Empty
              title="No workspaces yet"
              text="Create your first workspace to start planning."
            />
          ))
        )}
      </main>
    </AppShell>
  );
}
