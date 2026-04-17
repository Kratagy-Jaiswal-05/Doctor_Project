import { apiClient } from "./apiClient";

export async function fetchDoctors() {
  return apiClient.get("/api/doctors");
}

export async function adminCreateDoctor(doctor, adminToken) {
  return apiClient.post("/api/doctors", doctor, {
    headers: { "x-admin-token": adminToken },
  });
}

export async function adminUpdateDoctor(id, patch, adminToken) {
  return apiClient.put(`/api/doctors/${id}`, patch, {
    headers: { "x-admin-token": adminToken },
  });
}

export async function adminDeleteDoctor(id, adminToken) {
  return apiClient.del(`/api/doctors/${id}`, undefined, {
    headers: { "x-admin-token": adminToken },
  });
}

