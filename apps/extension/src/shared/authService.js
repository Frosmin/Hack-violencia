

const API_BASE = "http://localhost:3000/api/auth";


export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Error al registrar usuario");
  }

  return data;
}


export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }


  await chrome.storage.local.set({ authToken: data.token, authUser: data.user });

  return data;
}


export async function getToken() {
  const result = await chrome.storage.local.get(["authToken"]);
  return result.authToken || null;
}


export async function getAuthUser() {
  const result = await chrome.storage.local.get(["authUser"]);
  return result.authUser || null;
}


export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}


export async function logout() {
  await chrome.storage.local.remove(["authToken", "authUser"]);
}
