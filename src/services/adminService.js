import { apiClient } from "./apiClient";

export async function adminLogin(username, password) {
  return apiClient.post("/api/admin/login", { username, password });
}

export async function adminFetchSummary(adminToken) {
  return apiClient.get("/api/admin/summary", { headers: { "x-admin-token": adminToken } });
}

