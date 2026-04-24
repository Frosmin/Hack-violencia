const API_BASE = "http://localhost:3000/api/auth";

function normalizeSession(data) {
  return {
    token: data.token ?? null,
    user: data.user ?? null,
    organization: data.organization ?? null,
    membership: data.membership ?? null,
  };
}

async function persistSession(data) {
  const session = normalizeSession(data);
  await chrome.storage.local.set({
    authToken: session.token,
    authUser: session.user,
    authOrganization: session.organization,
    authMembership: session.membership,
  });
  return session;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Error de autenticación");
  }
  return data;
}

export async function registerUser({ email, password, organizationName }) {
  const data = await fetchJson(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      ...(organizationName ? { organizationName } : {}),
    }),
  });

  return persistSession(data);
}

export async function loginUser(email, password) {
  const data = await fetchJson(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return persistSession(data);
}

export async function joinOrganization(joinCode) {
  const token = await getToken();
  const data = await fetchJson(`${API_BASE}/join-organization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ joinCode }),
  });

  return persistSession(data);
}

export async function refreshSession() {
  const token = await getToken();
  if (!token) return null;

  const data = await fetchJson(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return persistSession({ ...data, token });
}

export async function getToken() {
  const result = await chrome.storage.local.get(["authToken"]);
  return result.authToken || null;
}

export async function getAuthUser() {
  const result = await chrome.storage.local.get(["authUser"]);
  return result.authUser || null;
}

export async function getAuthSession() {
  const result = await chrome.storage.local.get([
    "authToken",
    "authUser",
    "authOrganization",
    "authMembership",
  ]);

  return {
    token: result.authToken || null,
    user: result.authUser || null,
    organization: result.authOrganization || null,
    membership: result.authMembership || null,
  };
}

export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

export function isOrganizationAdmin(session) {
  const role = session?.membership?.role;
  return role === "OWNER" || role === "ADMIN";
}

export async function logout() {
  await chrome.storage.local.remove([
    "authToken",
    "authUser",
    "authOrganization",
    "authMembership",
  ]);
}
