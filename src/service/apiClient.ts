/**
 * Base HTTP Client untuk request ke Backend API
 * Otomatis menyertakan token otorisasi dan menangani format ApiResponse standar
 */

import { ApiResponse } from "@/types/api";
import { getStoredToken } from "@/lib/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string> | string[];

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Record<string, string> | string[]
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...restOptions } = options;

  // Bangun URL dengan Query Params jika ada
  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // Siapkan header default
  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...((headers as Record<string, string>) || {}),
  };

  // Jika payload bukan FormData, set default Content-Type JSON
  if (!(restOptions.body instanceof FormData) && !reqHeaders["Content-Type"]) {
    reqHeaders["Content-Type"] = "application/json";
  }

  // Sisipkan token JWT jika pengguna sudah login
  const token = getStoredToken();
  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...restOptions,
      headers: reqHeaders,
    });

    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: res.ok,
      message: res.statusText,
    }));

    if (!res.ok || !data.success) {
      throw new ApiError(
        data.message || `Request gagal dengan status ${res.status}`,
        res.status,
        data.errors
      );
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan jaringan";
    throw new ApiError(message, 500);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),

  /**
   * Helper khusus untuk unggah file multipart/form-data
   */
  upload: <T>(
    endpoint: string,
    formData: FormData,
    method: "POST" | "PUT" | "PATCH" = "POST"
  ) =>
    request<T>(endpoint, {
      method,
      body: formData,
    }),
};

export default apiClient;
