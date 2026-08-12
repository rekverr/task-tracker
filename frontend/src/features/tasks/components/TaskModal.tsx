import type { Task, User } from "../../../shared/types";
import { TaskForm } from "./TaskForm";
import { TaskComments } from "./TaskComments";

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

        <TaskForm
          task={task}
          projectId={projectId}
          members={members}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />

        {task && <TaskComments taskId={task.id} />}
      </section>
    </div>
  );
}
