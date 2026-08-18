const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4200";

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "user" | "admin";
};

export async function authRequest(path: "/api/auth/login" | "/api/auth/signup", payload: AuthPayload) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function authorizedRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("jobmatchToken");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("jobmatchToken");
    localStorage.removeItem("jobmatchUser");
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new Error(data.message || "Session expired, please login again");
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
