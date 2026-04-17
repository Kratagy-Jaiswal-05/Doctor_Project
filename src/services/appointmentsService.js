import { apiClient } from "./apiClient";

export async function createAppointment(payload) {
  return apiClient.post("/api/appointments", payload);
}

export async function fetchMyAppointments(email) {
  return apiClient.get(`/api/appointments/me?email=${encodeURIComponent(email)}`);
}

export async function cancelMyAppointment(id, userEmail) {
  return apiClient.del(`/api/appointments/${id}`, { userEmail });
}

export async function adminFetchAppointments(adminToken) {
  return apiClient.get("/api/appointments", { headers: { "x-admin-token": adminToken } });
}

export async function adminUpdateAppointmentStatus(id, status, adminToken) {
  return apiClient.patch(
    `/api/appointments/${id}/status`,
    { status },
    { headers: { "x-admin-token": adminToken } }
  );
}

export async function adminDeleteAppointment(id, adminToken) {
  return apiClient.del(`/api/appointments/${id}`, undefined, {
    headers: { "x-admin-token": adminToken },
  });
}

