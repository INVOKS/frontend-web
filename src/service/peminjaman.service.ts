/**
 * Service untuk operasi Kelola Peminjaman (Ruangan & Barang)
 */

import apiClient from "./apiClient";
import { RoomBookingPayload, ItemBorrowingPayload } from "@/types/peminjaman";

export interface RoomBookingResponse {
  id: number;
  bookingCode: string;
  userId: number;
  roomId: number;
  activityName: string;
  activityDescription?: string;
  organizer: string;
  participantCount: number;
  picName: string;
  picPhone: string;
  status: "booked" | "cancelled";
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
  room?: {
    id: number;
    name: string;
    floor: string;
    building?: {
      name: string;
    };
  };
  slots?: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface ItemBorrowingResponse {
  id: number;
  borrowingCode: string;
  userId: number;
  activityName: string;
  picName: string;
  picPhone: string;
  status: "booked" | "completed" | "cancelled";
  completedAt?: string;
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
  units?: {
    id: number;
    unitCode: string;
    item?: {
      id: number;
      name: string;
      imageUrl: string;
    };
    returnStatus?: "borrowed" | "returned";
  }[];
  slots?: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface ReturnItemPayload {
  unitId?: number;
  unitCode?: string;
  condition?: "good" | "damaged" | "lost";
  notes?: string;
}

export const peminjamanService = {
  // ─── Peminjaman Ruangan ───────────────────────────────────────────────────

  /**
   * Mengambil semua daftar booking ruangan (Khusus Admin)
   */
  getAllRoomBookings: async () => {
    return apiClient.get<RoomBookingResponse[]>("/room-bookings");
  },

  /**
   * Mengambil daftar booking ruangan milik user yang sedang login
   */
  getMyRoomBookings: async () => {
    return apiClient.get<RoomBookingResponse[]>("/room-bookings/me");
  },

  /**
   * Mengambil detail 1 booking ruangan
   */
  getRoomBookingDetail: async (id: number | string) => {
    return apiClient.get<RoomBookingResponse>(`/room-bookings/${id}`);
  },

  /**
   * Mengajukan booking ruangan baru
   */
  createRoomBooking: async (payload: RoomBookingPayload) => {
    return apiClient.post<RoomBookingResponse>("/room-bookings", payload);
  },

  // ─── Peminjaman Barang ────────────────────────────────────────────────────

  /**
   * Mengambil semua daftar peminjaman barang (Khusus Admin)
   */
  getAllItemBorrowings: async () => {
    return apiClient.get<ItemBorrowingResponse[]>("/item-borrowings");
  },

  /**
   * Mengambil daftar peminjaman barang milik user yang sedang login
   */
  getMyItemBorrowings: async () => {
    return apiClient.get<ItemBorrowingResponse[]>("/item-borrowings/me");
  },

  /**
   * Mengambil detail 1 peminjaman barang
   */
  getItemBorrowingDetail: async (id: number | string) => {
    return apiClient.get<ItemBorrowingResponse>(`/item-borrowings/${id}`);
  },

  /**
   * Mengajukan peminjaman barang baru
   */
  createItemBorrowing: async (payload: ItemBorrowingPayload) => {
    return apiClient.post<ItemBorrowingResponse>("/item-borrowings", payload);
  },

  /**
   * Konfirmasi pengembalian unit barang oleh Admin
   */
  confirmItemReturn: async (
    borrowingId: number | string,
    payload: ReturnItemPayload
  ) => {
    return apiClient.patch<{ message: string }>(
      `/item-borrowings/${borrowingId}/return`,
      payload
    );
  },
};

export default peminjamanService;
