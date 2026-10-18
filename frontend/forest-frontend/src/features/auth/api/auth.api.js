import apiClient from "../../../lib/api-client";

export const login = async (firebaseIdToken) => {
  const { data } = await apiClient.post("/auth/login", { token: firebaseIdToken });
  return data;
};

export const logout = async () => {
  // The existing auth service exposes logout as GET; keep the client aligned with it.
  const { data } = await apiClient.get("/auth/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/api/user");
  return data.user;
};
