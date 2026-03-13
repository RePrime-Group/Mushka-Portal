const TOKEN_KEY = "mushka-auth-token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

/** Decode a JWT payload without verifying the signature (client-side only). */
function decodePayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns the decoded session if the stored token is present and not expired. */
export function getSession(): { email: string } | null {
  const token = getToken();
  if (!token) return null;
  const payload = decodePayload(token);
  if (!payload) return null;
  if (payload.exp * 1000 < Date.now()) {
    clearToken();
    return null;
  }
  return { email: payload.email };
}
