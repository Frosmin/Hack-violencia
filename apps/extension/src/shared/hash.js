export async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256WithFallback(text) {
  try {
    return await sha256(text);
  } catch {
    return btoa(unescape(encodeURIComponent(text))).slice(0, 64);
  }
}
