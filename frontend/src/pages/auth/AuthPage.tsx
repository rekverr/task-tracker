import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate, type AuthMode } from "../../features/auth";
import { setAuth } from "../../features/auth/model/authSlice";
import { useAppDispatch } from "../../shared/hooks/redux";
import { getApiErrorMessage } from "../../shared/lib/api-error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = { email?: string; password?: string };

function validateAuthFields(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = email.trim();
  if (!trimmed) errors.email = "Enter your email.";
  else if (!EMAIL_RE.test(trimmed))
    errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  return errors;
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const nextErrors = validateAuthFields(email, password);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const data = await authenticate(mode, email.trim(), password);
      dispatch(setAuth(data));
      navigate("/");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-semibold text-indigo-600">TASK TRACKER</p>
        <h1 className="mt-2 text-3xl font-bold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-slate-500">
          {mode === "login"
            ? "Sign in to manage your team’s work."
            : "Start organizing your team’s projects today."}
        </p>
        <form className="mt-7 space-y-4" onSubmit={submit} noValidate>
          <label className="field">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              aria-invalid={Boolean(fieldErrors.email)}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email)
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </label>
          <label className="field">
            Password
            <input
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              aria-invalid={Boolean(fieldErrors.password)}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password)
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Minimum 6 characters"
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </label>
          {error && <p className="alert">{error}</p>}
          <button className="btn w-full" disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            className="font-semibold text-indigo-600"
            onClick={() => navigate(mode === "login" ? "/register" : "/login")}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}
