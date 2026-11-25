/**
 * Konstanta Cache Keys & TTL (Time-To-Live)
 * Semua nama key dan durasi cache dipusatkan di sini agar:
 * 1. Tidak ada typo key yang berbeda-beda antar file
 * 2. Mudah mengubah durasi cache dari satu tempat
 * 3. Semua key diawali "invoks_cache_" agar mudah dibersihkan sekaligus (invalidateByPrefix)
 */

// ─── Nama-nama key yang disimpan di localStorage ─────────────────────────────

export const CACHE_KEYS = {
  // Data master Ruangan
  BUILDINGS: "invoks_cache_buildings",         // daftar semua gedung
  FACILITIES: "invoks_cache_facilities",        // daftar semua fasilitas
  ROOMS: "invoks_cache_rooms",                  // daftar semua ruangan (tanpa filter)
  ROOMS_BY_BUILDING: "invoks_cache_rooms_b_",  // prefix: ditambah buildingId di belakangnya

  // Data master Barang
  CATEGORIES: "invoks_cache_categories",        // daftar semua kategori barang
  ITEMS: "invoks_cache_items",                  // daftar semua barang (tanpa filter)
  ITEMS_BY_CATEGORY: "invoks_cache_items_c_",  // prefix: ditambah categoryId di belakangnya
} as const;

// ─── Durasi TTL dalam milidetik ───────────────────────────────────────────────

export const CACHE_TTL = {
  /**
   * Data master yang sangat jarang berubah.
   * Contoh: gedung, fasilitas, kategori barang
   * TTL: 30 menit
   */
  MASTER: 30 * 60 * 1000,

  /**
   * Data yang cukup sering berubah (admin bisa tambah/edit kapan saja).
   * Contoh: daftar ruangan, daftar barang
   * TTL: 5 menit
   */
  LIST: 5 * 60 * 1000,

  /**
   * Data detail satu item — biasanya tidak perlu dicache lama.
   * TTL: 2 menit
   */
  DETAIL: 2 * 60 * 1000,
} as const;

// ─── Helper: bangun key dinamis dengan ID ─────────────────────────────────────

/**
 * Buat key cache untuk ruangan berdasarkan buildingId.
 * Contoh: "invoks_cache_rooms_b_3"
 */
export function roomsByBuildingKey(buildingId: number | string): string {
  return `${CACHE_KEYS.ROOMS_BY_BUILDING}${buildingId}`;
}

/**
 * Buat key cache untuk barang berdasarkan categoryId.
 * Contoh: "invoks_cache_items_c_1"
 */
export function itemsByCategoryKey(categoryId: number | string): string {
  return `${CACHE_KEYS.ITEMS_BY_CATEGORY}${categoryId}`;
}
