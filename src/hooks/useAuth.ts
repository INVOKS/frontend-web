"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types/auth";
import {
  getStoredToken,
  getStoredUser,
  clearSession,
  loginAdmin as loginAdminApi,
  loginUser as loginUserApi,
} from "@/lib/auth";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inisialisasi sesi dari penyimpanan lokal / cookie
  const refreshAuth = useCallback(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    setToken(storedToken);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Fungsi Login Admin
  const loginAdmin = async (credentials: {
    email: string;
    password: string;
    ingatSaya?: boolean;
  }) => {
    setIsLoading(true);
    try {
      const response = await loginAdminApi(credentials);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        setToken(response.data.token || null);
        return { success: true, message: response.message };
      }
      return {
        success: false,
        message: response.message || "Login gagal",
        errors: response.errors,
      };
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Terjadi kesalahan saat login";
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Login Pengguna Biasa
  const loginUser = async (credentials: {
    email: string;
    password: string;
    ingatSaya?: boolean;
  }) => {
    setIsLoading(true);
    try {
      const response = await loginUserApi(credentials);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        setToken(response.data.token || null);
        return { success: true, message: response.message };
      }
      return {
        success: false,
        message: response.message || "Login gagal",
        errors: response.errors,
      };
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Terjadi kesalahan saat login";
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Logout
  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    router.replace("/login");
  }, [router]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
    loginAdmin,
    loginUser,
    logout,
    refreshAuth,
  };
}

export default useAuth;
