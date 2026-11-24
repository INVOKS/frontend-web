/**
 * Service untuk operasi data Barang, Kategori, dan Unit Barang
 */

import apiClient from "./apiClient";
import { ItemCategory, ItemUnit } from "@/types/barang";

export interface ItemResponseData {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  specifications?: Record<string, unknown>;
  imageUrl: string;
  isActive: boolean;
  category?: ItemCategory;
  units?: ItemUnit[];
  availableUnitsCount?: number;
  totalUnitsCount?: number;
}

export interface ItemQueryParams {
  categoryId?: number;
  search?: string;
  includeInactive?: boolean;
}

export const barangService = {
  /**
   * Mengambil semua daftar barang
   */
  getItems: async (params?: ItemQueryParams) => {
    return apiClient.get<ItemResponseData[]>("/items", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Mengambil detail 1 barang berdasarkan ID
   */
  getItemById: async (id: number | string) => {
    return apiClient.get<ItemResponseData>(`/items/${id}`);
  },

  /**
   * Menambah barang baru (menggunakan FormData karena ada upload file foto)
   */
  createItem: async (formData: FormData) => {
    return apiClient.upload<ItemResponseData>("/items", formData, "POST");
  },

  /**
   * Mengupdate data barang (bisa JSON atau FormData jika ada ganti foto)
   */
  updateItem: async (id: number | string, data: FormData | object) => {
    if (data instanceof FormData) {
      return apiClient.upload<ItemResponseData>(`/items/${id}`, data, "PUT");
    }
    return apiClient.put<ItemResponseData>(`/items/${id}`, data);
  },

  /**
   * Mengarsipkan / Menonaktifkan barang
   */
  archiveItem: async (id: number | string) => {
    return apiClient.patch<{ message: string }>(`/items/${id}/archive`);
  },

  /**
   * Mengaktifkan kembali barang yang diarsipkan
   */
  unarchiveItem: async (id: number | string) => {
    return apiClient.patch<{ message: string }>(`/items/${id}/unarchive`);
  },

  /**
   * Mengambil daftar master kategori barang (ELEKTRONIK, FURNITUR, dll)
   */
  getCategories: async () => {
    return apiClient.get<ItemCategory[]>("/item-categories");
  },

  /**
   * Mengambil daftar seluruh unit fisik barang
   */
  getItemUnits: async (params?: { itemId?: number; status?: string }) => {
    return apiClient.get<ItemUnit[]>("/item-units", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Menambah kode unit fisik baru ke barang tertentu
   */
  addUnitsToItem: async (itemId: number | string, unitCodes: string[]) => {
    return apiClient.post<{ message: string }>(`/items/${itemId}/units`, {
      unitCodes,
    });
  },
};

export default barangService;
