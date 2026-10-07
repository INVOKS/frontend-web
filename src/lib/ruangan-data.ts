export type Room = {
  name: string;
  min: number;
  max: number;
};

export type Floor = {
  id: string;      // "basement", "1", "2", ...
  label: string;   // "Basement", "Lantai 1", ...
  rooms: Room[];
};

export type Building = {
  name: string;    // "GEDUNG BNI"
  floors: Floor[];
};

// pola kapasitas 5 ruangan per lantai
const capacities = [
  [80, 100],
  [60, 80],
  [50, 80],
  [40, 80],
  [40, 60],
];

// prefix "B" untuk basement (Ruang B01..B05), "1" untuk lantai 1 (Ruang 101..105), dst.
function makeRooms(prefix: string): Room[] {
  return capacities.map(([min, max], i) => ({
    name: `Ruang ${prefix}0${i + 1}`,
    min,
    max,
  }));
}

function makeFloor(id: string): Floor {
  return {
    id,
    label: id === "basement" ? "Basement" : `Lantai ${id}`,
    rooms: makeRooms(id === "basement" ? "B" : id),
  };
}

export const buildings: Building[] = [
  {
    name: "GEDUNG BNI",
    floors: ["basement", "1", "2", "3"].map(makeFloor),
  },
  {
    name: "GEDUNG DIENG",
    floors: ["1", "2", "3", "4", "5", "6", "7"].map(makeFloor),
  },
  {
    name: "GEDUNG KP",
    floors: ["1", "2", "3", "4", "5"].map(makeFloor),
  },
];
