const API_BASE = "";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg = body && typeof body === "object" ? body.error : undefined;
    const err = new Error(msg || `Request failed: ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export const apiClient = {
  get: (path, options) => request(path, { ...(options || {}), method: "GET" }),
  post: (path, data, options) =>
    request(path, { ...(options || {}), method: "POST", body: JSON.stringify(data ?? {}) }),
  put: (path, data, options) =>
    request(path, { ...(options || {}), method: "PUT", body: JSON.stringify(data ?? {}) }),
  patch: (path, data, options) =>
    request(path, { ...(options || {}), method: "PATCH", body: JSON.stringify(data ?? {}) }),
  del: (path, data, options) =>
    request(path, {
      ...(options || {}),
      method: "DELETE",
      body: data === undefined ? undefined : JSON.stringify(data),
    }),
};

