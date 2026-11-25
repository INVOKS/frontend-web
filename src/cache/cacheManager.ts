/**
 * Core Cache Manager
 * Mengelola penyimpanan data sementara di localStorage dengan batas waktu kadaluarsa (TTL).
 * Pola kerjanya mirip apiClient.ts di service/ — satu engine terpusat yang dipakai seluruh cache helper.
 */

// ─── Struktur item yang disimpan di cache ────────────────────────────────────

interface CacheItem<T> {
  data: T;
  timestamp: number; // waktu penyimpanan (ms, dari Date.now())
  ttl: number;       // time-to-live dalam milidetik
}

// ─── Helper internal: baca & tulis localStorage dengan aman ─────────────────

function readStorage<T>(key: string): CacheItem<T> | null {
  if (typeof window === "undefined") return null; // aman untuk SSR Next.js
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheItem<T>;
  } catch {
    return null;
  }
}

function writeStorage<T>(key: string, item: CacheItem<T>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch {
    // localStorage penuh atau mode private — abaikan saja
  }
}

// ─── Public API cacheManager ─────────────────────────────────────────────────

/**
 * Simpan data ke cache dengan TTL tertentu.
 * @param key   Nama key (gunakan konstanta dari cacheKeys.ts)
 * @param data  Data yang ingin disimpan
 * @param ttlMs Durasi kadaluarsa dalam milidetik (default: 5 menit)
 */
export function setCache<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
  const item: CacheItem<T> = {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  };
  writeStorage(key, item);
}

/**
 * Ambil data dari cache.
 * Jika sudah melewati TTL (kadaluarsa), data dihapus otomatis dan dikembalikan null.
 * @param key Nama key cache
 * @returns Data yang tersimpan, atau null jika tidak ada / sudah expired
 */
export function getCache<T>(key: string): T | null {
  const item = readStorage<T>(key);
  if (!item) return null;

  const isExpired = Date.now() - item.timestamp > item.ttl;
  if (isExpired) {
    removeCache(key);
    return null;
  }

  return item.data;
}

/**
 * Hapus 1 item dari cache berdasarkan key.
 * Dipanggil saat ada mutasi data (create/update/delete) agar cache tidak basi.
 */
export function removeCache(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

/**
 * Hapus semua cache yang key-nya diawali dengan prefix tertentu.
 * Berguna untuk invalidasi seluruh domain sekaligus (misal semua cache ruangan).
 * @param prefix Awalan key yang ingin dibersihkan, contoh: "invoks_cache_room"
 */
export function invalidateByPrefix(prefix: string): void {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/**
 * Hapus SELURUH cache milik aplikasi invoks.
 * Dipanggil saat user logout agar tidak ada data lama yang tertinggal.
 */
export function clearAllCache(): void {
  invalidateByPrefix("invoks_cache_");
}

/**
 * Cek apakah suatu key masih valid (ada dan belum expired) tanpa mengambil datanya.
 * @param key Nama key cache
 * @returns true jika cache masih valid
 */
export function isCacheValid(key: string): boolean {
  const item = readStorage(key);
  if (!item) return false;
  return Date.now() - item.timestamp <= item.ttl;
}
