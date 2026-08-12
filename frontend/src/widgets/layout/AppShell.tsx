import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../../features/auth/api/authApi";
import { logout } from "../../features/auth/model/authSlice";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/redux";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const signOut = async () => {
    try {
      await logoutRequest();
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <>
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button
            className="text-lg font-bold tracking-tight"
            onClick={() => navigate("/")}
          >
            Task Tracker
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:block">
              {user?.email}
            </span>
            <button
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
