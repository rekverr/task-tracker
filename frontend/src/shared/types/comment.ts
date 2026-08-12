import type { User } from "./user";

export interface Comment {
  id: string;
  text: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
}
