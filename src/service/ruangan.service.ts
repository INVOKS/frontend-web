/**
 * Service untuk operasi Ruangan, Gedung, dan Fasilitas
 */

import apiClient from "./apiClient";
import { Facility } from "@/types/ruangan";

export interface RoomBackendData {
  id: number;
  buildingId: number;
  roomCode: string;
  name: string;
  floor: string;
  capacityMin: number;
  capacityMax: number;
  description?: string;
  imageUrl?: string;
  status: "available" | "borrowed" | "maintenance";
  isActive: boolean;
  building?: {
    id: number;
    name: string;
  };
  facilities?: Facility[];
}

export interface BuildingBackendData {
  id: number;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

export interface RoomQueryParams {
  buildingId?: number;
  floor?: string;
  includeInactive?: boolean;
}

export const ruanganService = {
  /**
   * Mengambil seluruh daftar ruangan (dapat difilter gedung atau lantai)
   */
  getRooms: async (params?: RoomQueryParams) => {
    return apiClient.get<RoomBackendData[]>("/rooms", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Mengambil detail 1 ruangan berdasarkan ID
   */
  getRoomById: async (id: number | string) => {
    return apiClient.get<RoomBackendData>(`/rooms/${id}`);
  },

  /**
   * Mengecek ketersediaan jadwal slot ruangan pada tanggal tertentu
   */
  getRoomAvailability: async (id: number | string, date: string) => {
    return apiClient.get<{ availableSlots: string[]; bookedSlots: string[] }>(
      `/rooms/${id}/availability`,
      { params: { date } }
    );
  },

  /**
   * Menambah ruangan baru (dengan file foto)
   */
  createRoom: async (formData: FormData) => {
    return apiClient.upload<RoomBackendData>("/rooms", formData, "POST");
  },

  /**
   * Mengupdate data ruangan
   */
  updateRoom: async (id: number | string, data: FormData | object) => {
    if (data instanceof FormData) {
      return apiClient.upload<RoomBackendData>(`/rooms/${id}`, data, "PUT");
    }
    return apiClient.put<RoomBackendData>(`/rooms/${id}`, data);
  },

  /**
   * Arsipkan / Nonaktifkan ruangan
   */
  archiveRoom: async (id: number | string) => {
    return apiClient.patch<{ message: string }>(`/rooms/${id}/archive`);
  },

  /**
   * Aktifkan kembali ruangan
   */
  unarchiveRoom: async (id: number | string) => {
    return apiClient.patch<{ message: string }>(`/rooms/${id}/unarchive`);
  },

  /**
   * Mengatur daftar fasilitas pada suatu ruangan
   */
  setRoomFacilities: async (roomId: number | string, facilityIds: number[]) => {
    return apiClient.put<{ message: string }>(`/rooms/${roomId}/facilities`, {
      facilityIds,
    });
  },

  /**
   * Mengambil daftar master gedung
   */
  getBuildings: async () => {
    return apiClient.get<BuildingBackendData[]>("/buildings");
  },

  /**
   * Mengambil daftar master fasilitas
   */
  getFacilities: async () => {
    return apiClient.get<Facility[]>("/facilities");
  },
};

export default ruanganService;
