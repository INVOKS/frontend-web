/**
 * Tipe data untuk Manajemen Ruangan, Gedung, dan Fasilitas
 */

export type RoomStatus = "available" | "borrowed" | "maintenance";

export interface Ruangan {
  id: string | number;
  nama: string; // e.g. "Ruang 101"
  name?: string; // Kompatibilitas alias backend/frontend
  roomCode?: string; // Kode unik ruangan
  gedung: string; // e.g. "Dieng", "BNI", "KP"
  buildingId?: number; // Relasi ke ID Gedung
  lantai: number | string; // 1, 2, "Basement"
  floor?: string; // Kompatibilitas alias
  kapasitas: number; // e.g. 80
  min: number; // Kapasitas minimum
  max: number; // Kapasitas maksimum
  gambar: string; // Path/URL foto ruangan
  imageUrl?: string; // Kompatibilitas alias
  deskripsi: string; // Keterangan ruangan
  description?: string; // Kompatibilitas alias
  fasilitas: string[]; // Daftar nama fasilitas (e.g. ["AC", "Proyektor"])
  status?: RoomStatus;
  isActive?: boolean;
}

export type Room = Ruangan;

export interface Floor {
  id: string; // "basement", "1", "2", ...
  label: string; // "Basement", "Lantai 1", ...
  rooms: Room[];
}

export interface Building {
  id?: number;
  name: string; // "GEDUNG BNI"
  code?: string;
  floors: Floor[];
}

export interface Facility {
  id: number;
  name: string;
  icon?: string;
}

export interface CreateRoomPayload {
  buildingId: number;
  roomCode: string;
  name: string;
  floor: string;
  capacityMin: number;
  capacityMax: number;
  description?: string;
  facilityIds?: number[];
  image?: File | string;
}

export interface UpdateRoomPayload extends Partial<CreateRoomPayload> {
  id: number | string;
}

