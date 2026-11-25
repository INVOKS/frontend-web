/**
 * Cache Helper untuk domain Barang, Kategori, dan Unit Barang
 * Membungkus cacheManager + CACHE_KEYS dengan tipe data yang spesifik dari @/types/barang
 * dan @/service/barang.service
 */

import { getCache, setCache, removeCache, invalidateByPrefix } from "./cacheManager";
import {
  CACHE_KEYS,
  CACHE_TTL,
  itemsByCategoryKey,
} from "./cacheKeys";
import { ItemCategory } from "@/types/barang";
import { ItemResponseData } from "@/service/barang.service";

// ─── Cache: Kategori Barang ───────────────────────────────────────────────────

/**
 * Ambil daftar kategori barang dari cache.
 * Null berarti cache tidak ada / sudah expired — perlu fetch ulang ke API.
 */
export function getCachedCategories(): ItemCategory[] | null {
  return getCache<ItemCategory[]>(CACHE_KEYS.CATEGORIES);
}

/**
 * Simpan daftar kategori barang ke cache selama 30 menit (data master, jarang berubah).
 */
export function setCachedCategories(data: ItemCategory[]): void {
  setCache(CACHE_KEYS.CATEGORIES, data, CACHE_TTL.MASTER);
}

// ─── Cache: Semua Barang ──────────────────────────────────────────────────────

/**
 * Ambil daftar semua barang dari cache (tanpa filter kategori).
 */
export function getCachedItems(): ItemResponseData[] | null {
  return getCache<ItemResponseData[]>(CACHE_KEYS.ITEMS);
}

/**
 * Simpan daftar semua barang ke cache selama 5 menit.
 */
export function setCachedItems(data: ItemResponseData[]): void {
  setCache(CACHE_KEYS.ITEMS, data, CACHE_TTL.LIST);
}

// ─── Cache: Barang per Kategori ───────────────────────────────────────────────

/**
 * Ambil daftar barang berdasarkan kategori dari cache.
 * @param categoryId ID kategori yang ingin dicek cachenya
 */
export function getCachedItemsByCategory(categoryId: number | string): ItemResponseData[] | null {
  return getCache<ItemResponseData[]>(itemsByCategoryKey(categoryId));
}

/**
 * Simpan daftar barang per kategori ke cache selama 5 menit.
 * @param categoryId ID kategori
 * @param data       Daftar barang dari API
 */
export function setCachedItemsByCategory(categoryId: number | string, data: ItemResponseData[]): void {
  setCache(itemsByCategoryKey(categoryId), data, CACHE_TTL.LIST);
}

// ─── Cache Invalidation Barang ────────────────────────────────────────────────

/**
 * Hapus semua cache yang berhubungan dengan barang.
 * Dipanggil setelah admin: tambah barang, edit barang, arsipkan/nonaktifkan barang,
 * atau menambah unit fisik barang.
 */
export function invalidateBarangCache(): void {
  removeCache(CACHE_KEYS.ITEMS);
  invalidateByPrefix(CACHE_KEYS.ITEMS_BY_CATEGORY); // hapus semua cache barang per kategori
}

/**
 * Hapus cache data master kategori barang.
 * Dipanggil jika admin menambah atau mengubah kategori baru.
 */
export function invalidateMasterBarangCache(): void {
  removeCache(CACHE_KEYS.CATEGORIES);
}
