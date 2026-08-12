import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProject } from "../../features/projects";
import {
  fetchProjectTasks,
  TASK_STATUSES,
  TaskColumn,
  TaskModal,
  updateTask,
  useProjectSocket,
} from "../../features/tasks";
import { fetchWorkspace } from "../../features/workspaces";
import { getApiErrorMessage } from "../../shared/lib/api-error";
import type { Project, Task, TaskStatus, Workspace } from "../../shared/types";
import { Loader, StateError } from "../../shared/ui";
import { AppShell } from "../../widgets/layout";

export function ProjectBoardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalTask, setModalTask] = useState<Task | null | "new">(null);

  const load = async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const projectData = await fetchProject(projectId);
      const [workspaceData, taskData] = await Promise.all([
        fetchWorkspace(projectData.workspaceId),
        fetchProjectTasks(projectId),
      ]);
      setProject(projectData);
      setWorkspace(workspaceData);
      setTasks(taskData.items);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [projectId]);

  useProjectSocket(projectId, setTasks);

  const move = async (task: Task, status: TaskStatus) => {
    if (task.status === status) return;
    const previous = tasks;
    setTasks((items) =>
      items.map((item) => (item.id === task.id ? { ...item, status } : item)),
    );
    try {
      await updateTask(task.id, { status });
    } catch (e) {
      setTasks(previous);
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-[1500px] p-5 sm:p-8">
        <button
          className="mb-5 text-sm font-semibold text-indigo-600"
          onClick={() =>
            navigate(workspace ? `/workspaces/${workspace.id}` : "/")
          }
        >
          ← Workspace
        </button>
        {loading ? (
          <Loader />
        ) : error ? (
          <StateError error={error} retry={load} />
        ) : (
          project && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">PROJECT BOARD</p>
                  <h1 className="page-title">{project.name}</h1>
                  <p className="subtitle">
                    Drag tasks between columns to update their status.
                  </p>
                </div>
                <button className="btn" onClick={() => setModalTask("new")}>
                  + New task
                </button>
              </div>
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {TASK_STATUSES.map((column) => (
                  <TaskColumn
                    key={column.value}
                    column={column}
                    tasks={tasks.filter((task) => task.status === column.value)}
                    onDrop={(task) => void move(task, column.value)}
                    onOpen={setModalTask}
                  />
                ))}
              </div>
              {modalTask && (
                <TaskModal
                  task={modalTask === "new" ? null : modalTask}
                  projectId={project.id}
                  members={workspace?.members?.map((m) => m.user) || []}
                  onClose={() => setModalTask(null)}
                  onSaved={(task, isNew) => {
                    setTasks((items) => {
                      const exists = items.some((item) => item.id === task.id);
                      if (isNew && !exists) return [task, ...items];
                      return items.map((item) =>
                        item.id === task.id ? task : item,
                      );
                    });
                    setModalTask(null);
                  }}
                  onDeleted={(id) => {
                    setTasks((items) => items.filter((task) => task.id !== id));
                    setModalTask(null);
                  }}
                />
              )}
            </>
          )
        )}
      </main>
    </AppShell>
  );
}
