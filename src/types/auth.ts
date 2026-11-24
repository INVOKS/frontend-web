/**
 * Tipe data untuk Autentikasi dan Pengguna (User & Admin)
 */

export type UserRole = "user" | "admin";
export type Gender = "female" | "male";

export interface AuthUser {
  id: number;
  fullName?: string;
  namaLengkap?: string; // Kompatibilitas frontend
  email: string;
  role: UserRole;
  gender?: Gender | string | null;
  dateOfBirth?: string | null;
  tanggalLahir?: string | null; // Kompatibilitas frontend
  department?: string | null;
  jurusan?: string | null; // Kompatibilitas frontend
  userType?: string | null;
  jenisPengguna?: string | null; // Kompatibilitas frontend
  academicId?: string | null;
  nimNidn?: string | null; // Kompatibilitas frontend
  phone?: string | null;
  noTelp?: string | null; // Kompatibilitas frontend
  profileImageUrl?: string | null;
  foto?: string | null; // Kompatibilitas frontend
  buildingId?: number | null;
  gedungId?: number | null; // Kompatibilitas frontend
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  ingatSaya?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
  gender?: Gender;
  dateOfBirth?: string;
  department?: string;
  userType?: string;
  academicId?: string;
  phone?: string;
  buildingId?: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
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

