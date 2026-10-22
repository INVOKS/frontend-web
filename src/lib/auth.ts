export interface AuthUser {
  id: number;
  namaLengkap: string;
  email: string;
  role: "user" | "admin";
  gender?: string | null;
  tanggalLahir?: string | null;
  jurusan?: string | null;
  jenisPengguna?: string | null;
  nimNidn?: string | null;
  noTelp?: string | null;
  foto?: string | null;
  gedungId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: AuthUser;
  };
  errors?: Record<string, string>;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "invoks_auth_token";
const USER_KEY = "invoks_auth_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY) || getCookie(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(
  token: string,
  user: AuthUser,
  ingatSaya: boolean = false
): void {
  if (typeof window === "undefined") return;

  // Simpan di localStorage
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Simpan juga di cookie agar middleware atau Next.js layout bisa mengaksesnya jika diperlukan
  const days = ingatSaya ? 30 : 1;
  setCookie(TOKEN_KEY, token, days);
  setCookie(USER_KEY, JSON.stringify(user), days);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  deleteCookie(TOKEN_KEY);
  deleteCookie(USER_KEY);
}

export async function loginAdmin(credentials: {
  email: string;
  password: string;
  ingatSaya?: boolean;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data: AuthResponse = await res.json();
  if (res.ok && data.success && data.data?.token && data.data.user) {
    saveSession(data.data.token, data.data.user, credentials.ingatSaya);
  }
  return data;
}

export async function loginUser(credentials: {
  email: string;
  password: string;
  ingatSaya?: boolean;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data: AuthResponse = await res.json();
  if (res.ok && data.success && data.data?.token && data.data.user) {
    saveSession(data.data.token, data.data.user, credentials.ingatSaya);
  }
  return data;
}

export async function registerUser(payload: {
  namaLengkap: string;
  email: string;
  password: string;
  konfirmasiPassword: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function getProfile(token?: string): Promise<AuthResponse> {
  const activeToken = token || getStoredToken();
  if (!activeToken) {
    return {
      success: false,
      message: "Tidak ada token yang tersimpan",
    };
  }

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${activeToken}`,
      Accept: "application/json",
    },
  });

  const data: AuthResponse = await res.json();
  if (res.ok && data.success && data.data?.user) {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
    }
  }
  return data;
}

export function logout(): void {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Cookie helpers
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}
