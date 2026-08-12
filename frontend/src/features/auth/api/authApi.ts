import { api } from "../../../shared/api/axios";
import type { User } from "../../../shared/types";

export type AuthMode = "login" | "register";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function authenticate(mode: AuthMode, email: string, password: string) {
  const { data } = await api.post<AuthResponse>(`/auth/${mode}`, {
    email,
    password,
  });
  return data;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}
