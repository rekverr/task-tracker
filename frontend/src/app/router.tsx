import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../features/auth";
import { AuthPage } from "../pages/auth";
import { ProjectBoardPage } from "../pages/projects";
import { WorkspacePage, WorkspacesPage } from "../pages/workspaces";
import { ErrorBoundary } from "../shared/ui";

export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<WorkspacesPage />} />
            <Route
              path="/workspaces/:workspaceId"
              element={<WorkspacePage />}
            />
            <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
