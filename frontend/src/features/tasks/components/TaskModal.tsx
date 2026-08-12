import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createComment,
  fetchTaskComments,
} from "../../comments/api/commentsApi";
import { getApiErrorMessage } from "../../../shared/lib/api-error";
import type {
  Comment,
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from "../../../shared/types";
import { createTask, deleteTask, updateTask } from "../api/tasksApi";
import { TASK_PRIORITIES, TASK_STATUSES } from "../constants";

export function TaskModal({
  task,
  projectId,
  members,
  onClose,
  onSaved,
  onDeleted,
}: {
  task: Task | null;
  projectId: string;
  members: User[];
  onClose: () => void;
  onSaved: (task: Task, isNew: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || "MEDIUM",
  );
  const [status, setStatus] = useState<TaskStatus>(task?.status || "TODO");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [deadline, setDeadline] = useState(task?.deadline?.slice(0, 10) || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!task) return;
    fetchTaskComments(task.id)
      .then(setComments)
      .catch(() => setComments([]));
  }, [task]);

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

  const addComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!task || !commentText.trim()) return;
    try {
      const data = await createComment(task.id, commentText);
      setComments((items) => [...items, data]);
      setCommentText("");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const remove = async () => {
    if (!task || !confirm("Delete this task?")) return;
    try {
      await deleteTask(task.id);
      onDeleted(task.id);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 overflow-y-auto bg-slate-950/45 p-4"
      onMouseDown={onClose}
    >
      <section
        className="mx-auto my-8 max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between gap-4">
          <h2 className="text-xl font-bold">
            {task ? "Edit task" : "New task"}
          </h2>
          <button className="text-xl text-slate-400" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={save} noValidate>
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
        {task && (
          <section className="mt-8 border-t pt-6">
            <h3 className="font-bold">Comments</h3>
            <div className="mt-3 space-y-3">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-lg bg-slate-50 p-3"
                >
                  <p className="text-sm">{comment.text}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {comment.author.email} ·{" "}
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </article>
              ))}
              {!comments.length && (
                <p className="text-sm text-slate-500">No comments yet.</p>
              )}
            </div>
            <form className="mt-4 flex gap-2" onSubmit={addComment}>
              <input
                className="input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment"
                maxLength={2000}
              />
              <button className="btn">Send</button>
            </form>
          </section>
        )}
      </section>
    </div>
  );
}
