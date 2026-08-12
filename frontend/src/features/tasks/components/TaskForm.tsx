import { useState } from "react";
import type { FormEvent } from "react";
import { getApiErrorMessage } from "../../../shared/lib/api-error";
import type {
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from "../../../shared/types";
import { createTask, deleteTask, updateTask } from "../api/tasksApi";
import { TASK_PRIORITIES, TASK_STATUSES } from "../constants";

export function TaskForm({
  task,
  projectId,
  members,
  onSaved,
  onDeleted,
}: {
  task: Task | null;
  projectId: string;
  members: User[];
  onSaved: (task: Task, isNew: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "MEDIUM");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "TODO");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [deadline, setDeadline] = useState(task?.deadline?.slice(0, 10) || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter a task title.");
      return;
    }
    setSaving(true);
    setError("");

    const body = {
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      status,
      assigneeId: assigneeId || undefined,
      deadline: deadline
        ? new Date(`${deadline}T12:00:00`).toISOString()
        : null,
    };

    try {
      const data = task
        ? await updateTask(task.id, body)
        : await createTask(projectId, body);
      onSaved(data, !task);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!task || !window.confirm("Delete this task?")) return;
    try {
      await deleteTask(task.id);
      onDeleted(task.id);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={save} noValidate>
      {/* Всі твої label/input залишаються без змін */}
      <label className="field sm:col-span-2">
        Title
        <input
          maxLength={200}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
        />
      </label>
      <label className="field sm:col-span-2">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>
      <label className="field">
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          {TASK_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Priority
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          {TASK_PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Assignee
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.email}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Deadline
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </label>

      {error && <p className="alert sm:col-span-2">{error}</p>}

      <div className="flex justify-between sm:col-span-2">
        <div>
          {task && (
            <button
              type="button"
              className="text-sm font-semibold text-rose-600"
              onClick={remove}
            >
              Delete task
            </button>
          )}
        </div>
        <button className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save task"}
        </button>
      </div>
    </form>
  );
}
