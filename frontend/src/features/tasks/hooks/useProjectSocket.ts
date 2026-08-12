import { useEffect, type Dispatch, type SetStateAction } from "react";
import { io, type Socket } from "socket.io-client";
import type { Task } from "../../../shared/types";

type SetTasks = Dispatch<SetStateAction<Task[]>>;

export function useProjectSocket(projectId: string | undefined, setTasks: SetTasks) {
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!projectId || !token) return;

    const socket: Socket = io(
      import.meta.env.VITE_API_URL || 'http://localhost:3000',
      { auth: { token } },
    );

    socket.emit("joinProject", projectId);
    socket.on("taskCreated", (task: Task) =>
      setTasks((items) =>
        items.some((item) => item.id === task.id) ? items : [task, ...items],
      ),
    );
    socket.on("taskUpdated", (task: Task) =>
      setTasks((items) =>
        items.map((item) => (item.id === task.id ? task : item)),
      ),
    );
    socket.on("taskDeleted", ({ id }: { id: string }) =>
      setTasks((items) => items.filter((item) => item.id !== id)),
    );

    return () => {
      socket.emit("leaveProject", projectId);
      socket.disconnect();
    };
  }, [projectId, token, setTasks]);
}
