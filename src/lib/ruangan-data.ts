export type Ruangan = {
  id: string | number;
  nama: string;          // "Ruang 101"
  gedung: string;        // "Dieng", "BNI", "KP"
  lantai: number | string; // 1, 2, "Basement"
  kapasitas: number;     // 80
  min: number;           // 80
  max: number;           // 100
  gambar: string;        // "/images/ruang1.jpg"
  imageUrl?: string;     // alias kompatibilitas
  name: string;          // alias kompatibilitas
  deskripsi: string;     // "Ruangan kelas yang nyaman dan bersih..."
  fasilitas: string[];   // ["Papan Tulis", "Meja", "Kursi", "LCD Proyektor", "Layar Proyektor", "AC"]
};

export type Room = Ruangan;

export type Floor = {
  id: string;      // "basement", "1", "2", ...
  label: string;   // "Basement", "Lantai 1", ...
  rooms: Room[];
};

export type Building = {
  name: string;    // "GEDUNG BNI"
  floors: Floor[];
};

// Pola kapasitas 5 ruangan per lantai
const capacities = [
  [80, 100],
  [60, 80],
  [50, 80],
  [40, 80],
  [40, 60],
];

const defaultFasilitas = [
  "Papan Tulis",
  "Meja",
  "Kursi",
  "LCD Proyektor",
  "Layar Proyektor",
  "AC",
];

const defaultDeskripsi =
  "Ruangan kelas yang nyaman dan bersih untuk menunjang proses pembelajaran, kegiatan perkuliahan, diskusi kelompok, seminar, serta kegiatan akademik lainnya.";

function getGedungLabel(buildingName: string): string {
  const clean = buildingName.replace(/^GEDUNG\s+/i, "").trim();
  if (clean.toUpperCase() === "DIENG") return "Dieng";
  return clean.toUpperCase(); // BNI, KP
}

function makeRooms(buildingName: string, floorId: string): Room[] {
  const prefix = floorId === "basement" ? "B" : floorId;
  const gedung = getGedungLabel(buildingName);
  const lantai = floorId === "basement" ? "Basement" : Number(floorId) || floorId;

  return capacities.map(([min, max], i) => {
    const roomName = `Ruang ${prefix}0${i + 1}`;
    const imgUrl = `/images/ruang${i + 1}.jpg`;
    return {
      id: `${gedung.toLowerCase()}-${floorId}-${i + 1}`,
      nama: roomName,
      name: roomName,
      gedung,
      lantai,
      kapasitas: min,
      min,
      max,
      gambar: imgUrl,
      imageUrl: imgUrl,
      deskripsi: defaultDeskripsi,
      fasilitas: defaultFasilitas,
    };
  });
}

function makeFloor(buildingName: string, id: string): Floor {
  return {
    id,
    label: id === "basement" ? "Basement" : `Lantai ${id}`,
    rooms: makeRooms(buildingName, id),
  };
}

export const buildings: Building[] = [
  {
    name: "GEDUNG BNI",
    floors: ["basement", "1", "2", "3"].map((id) => makeFloor("GEDUNG BNI", id)),
  },
  {
    name: "GEDUNG DIENG",
    floors: ["1", "2", "3", "4", "5", "6", "7"].map((id) =>
      makeFloor("GEDUNG DIENG", id)
    ),
  },
  {
    name: "GEDUNG KP",
    floors: ["1", "2", "3", "4", "5"].map((id) => makeFloor("GEDUNG KP", id)),
  },
];
