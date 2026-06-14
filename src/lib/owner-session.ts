// Client-side helpers for owner token in localStorage.
const KEY = "cleenogo_owner_token";

export function getOwnerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setOwnerToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, token);
}

export function clearOwnerToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function isTokenLikelyValid(token: string | null): boolean {
  if (!token) return false;
  const [p] = token.split(".");
  if (!p) return false;
  try {
    const json = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" && json.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
