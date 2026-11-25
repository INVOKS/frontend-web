/**
 * Cache Helper untuk domain Ruangan, Gedung, dan Fasilitas
 * Membungkus cacheManager + CACHE_KEYS dengan tipe data yang spesifik dari @/types/ruangan
 * dan @/service/ruangan.service
 */

import { getCache, setCache, removeCache, invalidateByPrefix } from "./cacheManager";
import {
  CACHE_KEYS,
  CACHE_TTL,
  roomsByBuildingKey,
} from "./cacheKeys";
import { Facility } from "@/types/ruangan";
import {
  RoomBackendData,
  BuildingBackendData,
} from "@/service/ruangan.service";

// ─── Cache: Gedung ────────────────────────────────────────────────────────────

/**
 * Ambil daftar gedung dari cache.
 * Null berarti cache tidak ada / sudah expired — perlu fetch ulang ke API.
 */
export function getCachedBuildings(): BuildingBackendData[] | null {
  return getCache<BuildingBackendData[]>(CACHE_KEYS.BUILDINGS);
}

/**
 * Simpan daftar gedung ke cache selama 30 menit (data master, jarang berubah).
 */
export function setCachedBuildings(data: BuildingBackendData[]): void {
  setCache(CACHE_KEYS.BUILDINGS, data, CACHE_TTL.MASTER);
}

// ─── Cache: Fasilitas ─────────────────────────────────────────────────────────

/**
 * Ambil daftar fasilitas dari cache.
 */
export function getCachedFacilities(): Facility[] | null {
  return getCache<Facility[]>(CACHE_KEYS.FACILITIES);
}

/**
 * Simpan daftar fasilitas ke cache selama 30 menit.
 */
export function setCachedFacilities(data: Facility[]): void {
  setCache(CACHE_KEYS.FACILITIES, data, CACHE_TTL.MASTER);
}

// ─── Cache: Semua Ruangan ─────────────────────────────────────────────────────

/**
 * Ambil daftar semua ruangan dari cache (tanpa filter gedung).
 */
export function getCachedRooms(): RoomBackendData[] | null {
  return getCache<RoomBackendData[]>(CACHE_KEYS.ROOMS);
}

/**
 * Simpan daftar semua ruangan ke cache selama 5 menit.
 */
export function setCachedRooms(data: RoomBackendData[]): void {
  setCache(CACHE_KEYS.ROOMS, data, CACHE_TTL.LIST);
}

// ─── Cache: Ruangan per Gedung ────────────────────────────────────────────────

/**
 * Ambil daftar ruangan berdasarkan gedung dari cache.
 * @param buildingId ID gedung yang ingin dicek cachenya
 */
export function getCachedRoomsByBuilding(buildingId: number | string): RoomBackendData[] | null {
  return getCache<RoomBackendData[]>(roomsByBuildingKey(buildingId));
}

/**
 * Simpan daftar ruangan per gedung ke cache selama 5 menit.
 * @param buildingId ID gedung
 * @param data       Daftar ruangan dari API
 */
export function setCachedRoomsByBuilding(buildingId: number | string, data: RoomBackendData[]): void {
  setCache(roomsByBuildingKey(buildingId), data, CACHE_TTL.LIST);
}

// ─── Cache Invalidation Ruangan ───────────────────────────────────────────────

/**
 * Hapus semua cache yang berhubungan dengan ruangan.
 * Dipanggil setelah admin: tambah ruangan, edit ruangan, arsipkan/nonaktifkan ruangan,
 * atau mengubah fasilitas ruangan.
 */
export function invalidateRuanganCache(): void {
  removeCache(CACHE_KEYS.ROOMS);
  invalidateByPrefix(CACHE_KEYS.ROOMS_BY_BUILDING); // hapus semua cache ruangan per gedung
}

/**
 * Hapus cache data master (gedung & fasilitas).
 * Dipanggil jika admin menambah gedung atau fasilitas baru.
 */
export function invalidateMasterRuanganCache(): void {
  removeCache(CACHE_KEYS.BUILDINGS);
  removeCache(CACHE_KEYS.FACILITIES);
}
