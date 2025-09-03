const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://beautysalon-qq6r.vercel.app/";

export async function api(path, { method = "GET", body, headers } = {}) {
  const token = localStorage.getItem("token"); // optional fallback
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    credentials: "include", // send/receive cookie
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) throw new Error(data?.error || data?.message || "Request failed");
  return data;
}
