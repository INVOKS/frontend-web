/**
 * Tipe data untuk Manajemen Barang, Inventaris, dan Kategori
 */

export type KategoriBarang = "ELEKTRONIK" | "FURNITUR" | string;

export interface ItemCategory {
  id: number;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export type UnitCondition = "good" | "damaged" | "lost";
export type UnitStatus = "available" | "borrowed" | "maintenance";

export interface ItemUnit {
  id: number;
  itemId: number;
  unitCode: string;
  condition: UnitCondition;
  status: UnitStatus;
  notes?: string | null;
}

export interface Barang {
  id: string | number;
  nama: string;
  kategori: KategoriBarang;
  gambar: string;
  kodeBarang: string;
  kodeList?: string[];
  detail: string;
  spesifikasi: string[] | Record<string, unknown>;
  stokTersedia?: number;
  totalStok?: number;
  isActive?: boolean;
}

export interface CreateBarangPayload {
  name: string;
  categoryId: number;
  description?: string;
  specifications?: string[] | Record<string, unknown>;
  image?: File | string;
  initialUnits?: string[];
}

export interface UpdateBarangPayload extends Partial<CreateBarangPayload> {
  id: number | string;
}

