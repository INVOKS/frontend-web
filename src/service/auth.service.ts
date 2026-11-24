/**
 * Service untuk operasi autentikasi dan akun pengguna/admin
 */

import apiClient from "./apiClient";
import { AuthUser, LoginCredentials, RegisterPayload } from "@/types/auth";
import { ApiResponse } from "@/types/api";

export interface AuthSuccessData {
  token: string;
  user: AuthUser;
}

export const authService = {
  /**
   * Login khusus Admin
   */
  loginAdmin: async (credentials: LoginCredentials) => {
    return apiClient.post<AuthSuccessData>("/auth/admin/login", credentials);
  },

  /**
   * Login Pengguna biasa
   */
  loginUser: async (credentials: LoginCredentials) => {
    return apiClient.post<AuthSuccessData>("/auth/login", credentials);
  },

  /**
   * Registrasi Pengguna baru
   */
  register: async (payload: RegisterPayload) => {
    return apiClient.post<{ user: AuthUser }>("/auth/register", payload);
  },

  /**
   * Ambil data profil user yang sedang login saat ini
   */
  getMe: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    return apiClient.get<{ user: AuthUser }>("/auth/me");
  },
};

export default authService;
