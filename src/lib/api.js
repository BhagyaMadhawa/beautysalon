// src/lib/api.js
const BASE =
  (import.meta?.env && import.meta.env.VITE_API_BASE_URL) ||
  "https://beautysalon-qq6r.vercel.app";

/** Join base + path, but pass absolute URLs through unchanged */
function joinUrl(path) {
  if (!path) throw new Error("api(): path is required");
  if (/^https?:\/\//i.test(path)) return path; // absolute -> as-is
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE.replace(/\/+$/, "")}${p}`;
}

export async function api(
  path,
  { method = "GET", body, headers = {}, credentials = "include", skipAuth = false, ...rest } = {}
) {
  const url = joinUrl(path);

  const token = localStorage.getItem("token");
  const finalHeaders = {
    // Don't set Content-Type here; set conditionally below
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const init = { method, headers: finalHeaders, credentials, ...rest };

  // Body handling (FormData vs JSON)
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      // Let the browser set multipart boundary
      init.body = body;
    } else {
      finalHeaders["Content-Type"] = finalHeaders["Content-Type"] || "application/json";
      init.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, init);
  const raw = await res.text();

  // Try to parse JSON if present
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    // non-JSON response; keep raw for error visibility
  }

  if (!res.ok) {
    const message =
      data?.error || data?.message || `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = data ?? raw;
    throw err;
  }
  return data ?? raw;
}

/* Optional convenience helpers */
export const get = (path, opts = {}) => api(path, { ...opts, method: "GET" });
export const post = (path, body, opts = {}) => api(path, { ...opts, method: "POST", body });
export const put = (path, body, opts = {}) => api(path, { ...opts, method: "PUT", body });
export const patch = (path, body, opts = {}) => api(path, { ...opts, method: "PATCH", body });
export const del = (path, opts = {}) => api(path, { ...opts, method: "DELETE" });
