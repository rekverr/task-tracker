import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createComment,
  fetchTaskComments,
} from "../../comments/api/commentsApi";
import { getApiErrorMessage } from "../../../shared/lib/api-error";
import type { Comment } from "../../../shared/types";

export function TaskComments({ taskId }: { taskId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTaskComments(taskId)
      .then(setComments)
      .catch(() => setComments([]));
  }, [taskId]);

  const addComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    setError("");

    try {
      const data = await createComment(taskId, commentText);
      setComments((items) => [...items, data]);
      setCommentText("");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <section className="mt-8 border-t pt-6">
      <h3 className="font-bold">Comments</h3>
      <div className="mt-3 space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-lg bg-slate-50 p-3">
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

      <form className="mt-4 flex flex-col gap-2" onSubmit={addComment}>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            maxLength={2000}
          />
          <button className="btn">Send</button>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </form>
    </section>
  );
}
