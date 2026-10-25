import apiClient from "../../../lib/api-client";

export const register = async (user) => {
  const { data } = await apiClient.post("/auth/register", user);
  return data;
};

export const login = async (credentials) => {
  const body = typeof credentials === "string"
    ? { token: credentials }
    : credentials;
  const { data } = await apiClient.post("/auth/login", body);
  return data;
};

export const logout = async () => {
  // The existing auth service exposes logout as GET; keep the client aligned with it.
  const { data } = await apiClient.get("/auth/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/user");
  return data.user;
};
