export type KategoriBarang = "ELEKTRONIK" | "FURNITUR";

export type Barang = {
  id: string;
  nama: string;
  kategori: KategoriBarang;
  gambar: string;
  kodeBarang: string;
  kodeList?: string[];
  detail: string;
  spesifikasi: string[];
};

export const initialBarangList: Barang[] = [
  // ── ELEKTRONIK ──────────────────────────────────────────────
  {
    id: "e-1",
    nama: "Proyektor",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E1.png",
    kodeBarang: "PK_01",
    kodeList: ["PK_01", "PK_02", "PK_03", "PK_04"],
    detail:
      "Proyektor multimedia berdesain kompak dengan lensa fokus presisi dan port lengkap, cocok untuk kebutuhan rapat, kelas, hingga home theater.",
    spesifikasi: [
      "Resolusi: Full HD (1920 x 1080)",
      "Kecerahan: 3.500 ANSI Lumens",
      "Rasio Aspek: 4:3 / 16:9",
      "Konektivitas: HDMI, VGA, USB, Audio 3.5mm",
      "Daya Tahan Lampu: hingga 10.000 jam",
    ],
  },
  {
    id: "e-2",
    nama: "HDMI",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E2.png",
    kodeBarang: "HD_01",
    kodeList: ["HD_01", "HD_02", "HD_03", "HD_04", "HD_05"],
    detail:
      "Kabel HDMI kecepatan tinggi dengan pelindung ganda untuk transmisi audio dan video beresolusi tinggi tanpa delay.",
    spesifikasi: [
      "Versi: HDMI 2.0 High Speed",
      "Panjang Kabel: 3 Meter",
      "Resolusi Maksimal: 4K @ 60Hz",
      "Bahan Konektor: Gold-Plated",
      "Kompatibilitas: Laptop, PC, Proyektor, TV",
    ],
  },
  {
    id: "e-3",
    nama: "Mic Wireless",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E3.png",
    kodeBarang: "MC_01",
    kodeList: ["MC_01", "MC_02", "MC_03"],
    detail:
      "Set mikrofon nirkabel dual-channel dengan receiver digital untuk suara vokal jernih dan bebas distorsi di berbagai kegiatan seminar dan presentasi.",
    spesifikasi: [
      "Frekuensi: UHF Digital 600-690 MHz",
      "Jangkauan Operasi: Hingga 50 meter",
      "Baterai: 2x AA per mikrofon",
      "Output: XLR Balanced & 6.35mm Jack",
      "Fitur: Noise Reduction & Auto Pairing",
    ],
  },
  {
    id: "e-4",
    nama: "Sound",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E4.png",
    kodeBarang: "SD_01",
    kodeList: ["SD_01", "SD_02"],
    detail:
      "Speaker portable aktif multifungsi dengan daya output tinggi, bass bertenaga, dan kemudahan koneksi bluetooth untuk ruangan besar.",
    spesifikasi: [
      "Daya Output: 150 Watt RMS",
      "Ukuran Woofer: 8 Inch",
      "Koneksi: Bluetooth 5.0, USB, AUX, Mic In",
      "Daya Tahan Baterai: Hingga 8 jam",
      "Bobot: 6.5 kg dengan handle ergonomis",
    ],
  },
  {
    id: "e-5",
    nama: "Camera",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E5.png",
    kodeBarang: "CM_01",
    kodeList: ["CM_01", "CM_02"],
    detail:
      "Kamera saku digital profesional dengan sensor gambar beresolusi tinggi dan zoom optik fleksibel untuk dokumentasi kegiatan kampus.",
    spesifikasi: [
      "Resolusi Sensor: 20.1 Megapixel",
      "Video: Full HD 1080p @ 60fps",
      "Optical Zoom: 4.2x Optical Zoom",
      "Layar: 3.0 inch Tilt LCD Touchscreen",
      "Konektivitas: Wi-Fi, NFC, Micro-HDMI",
    ],
  },
  // Baris 2 Elektronik (sesuai tampilan desain di Figma)
  {
    id: "e-6",
    nama: "Proyektor",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E1.png",
    kodeBarang: "PK_02",
    kodeList: ["PK_01", "PK_02", "PK_03"],
    detail:
      "Proyektor multimedia berdesain kompak dengan lensa fokus presisi dan port lengkap, cocok untuk kebutuhan rapat, kelas, hingga home theater.",
    spesifikasi: [
      "Resolusi: Full HD (1920 x 1080)",
      "Kecerahan: 3.500 ANSI Lumens",
      "Rasio Aspek: 4:3 / 16:9",
      "Konektivitas: HDMI, VGA, USB, Audio 3.5mm",
      "Daya Tahan Lampu: hingga 10.000 jam",
    ],
  },
  {
    id: "e-7",
    nama: "HDMI",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E2.png",
    kodeBarang: "HD_02",
    kodeList: ["HD_01", "HD_02", "HD_03"],
    detail:
      "Kabel HDMI kecepatan tinggi dengan pelindung ganda untuk transmisi audio dan video beresolusi tinggi tanpa delay.",
    spesifikasi: [
      "Versi: HDMI 2.0 High Speed",
      "Panjang Kabel: 3 Meter",
      "Resolusi Maksimal: 4K @ 60Hz",
      "Bahan Konektor: Gold-Plated",
      "Kompatibilitas: Laptop, PC, Proyektor, TV",
    ],
  },
  {
    id: "e-8",
    nama: "Mic Wireless",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E3.png",
    kodeBarang: "MC_02",
    kodeList: ["MC_01", "MC_02", "MC_03"],
    detail:
      "Set mikrofon nirkabel dual-channel dengan receiver digital untuk suara vokal jernih dan bebas distorsi di berbagai kegiatan seminar dan presentasi.",
    spesifikasi: [
      "Frekuensi: UHF Digital 600-690 MHz",
      "Jangkauan Operasi: Hingga 50 meter",
      "Baterai: 2x AA per mikrofon",
      "Output: XLR Balanced & 6.35mm Jack",
      "Fitur: Noise Reduction & Auto Pairing",
    ],
  },
  {
    id: "e-9",
    nama: "Sound",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E4.png",
    kodeBarang: "SD_02",
    kodeList: ["SD_01", "SD_02"],
    detail:
      "Speaker portable aktif multifungsi dengan daya output tinggi, bass bertenaga, dan kemudahan koneksi bluetooth untuk ruangan besar.",
    spesifikasi: [
      "Daya Output: 150 Watt RMS",
      "Ukuran Woofer: 8 Inch",
      "Koneksi: Bluetooth 5.0, USB, AUX, Mic In",
      "Daya Tahan Baterai: Hingga 8 jam",
      "Bobot: 6.5 kg dengan handle ergonomis",
    ],
  },
  {
    id: "e-10",
    nama: "Camera",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E5.png",
    kodeBarang: "CM_02",
    kodeList: ["CM_01", "CM_02"],
    detail:
      "Kamera saku digital profesional dengan sensor gambar beresolusi tinggi dan zoom optik fleksibel untuk dokumentasi kegiatan kampus.",
    spesifikasi: [
      "Resolusi Sensor: 20.1 Megapixel",
      "Video: Full HD 1080p @ 60fps",
      "Optical Zoom: 4.2x Optical Zoom",
      "Layar: 3.0 inch Tilt LCD Touchscreen",
      "Konektivitas: Wi-Fi, NFC, Micro-HDMI",
    ],
  },
  // Baris 3 Elektronik
  {
    id: "e-11",
    nama: "Proyektor",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E1.png",
    kodeBarang: "PK_03",
    kodeList: ["PK_01", "PK_02", "PK_03"],
    detail:
      "Proyektor multimedia berdesain kompak dengan lensa fokus presisi dan port lengkap, cocok untuk kebutuhan rapat, kelas, hingga home theater.",
    spesifikasi: [
      "Resolusi: Full HD (1920 x 1080)",
      "Kecerahan: 3.500 ANSI Lumens",
      "Rasio Aspek: 4:3 / 16:9",
      "Konektivitas: HDMI, VGA, USB, Audio 3.5mm",
      "Daya Tahan Lampu: hingga 10.000 jam",
    ],
  },
  {
    id: "e-12",
    nama: "HDMI",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E2.png",
    kodeBarang: "HD_03",
    kodeList: ["HD_01", "HD_02", "HD_03"],
    detail:
      "Kabel HDMI kecepatan tinggi dengan pelindung ganda untuk transmisi audio dan video beresolusi tinggi tanpa delay.",
    spesifikasi: [
      "Versi: HDMI 2.0 High Speed",
      "Panjang Kabel: 3 Meter",
      "Resolusi Maksimal: 4K @ 60Hz",
      "Bahan Konektor: Gold-Plated",
      "Kompatibilitas: Laptop, PC, Proyektor, TV",
    ],
  },
  {
    id: "e-13",
    nama: "Mic Wireless",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E3.png",
    kodeBarang: "MC_03",
    kodeList: ["MC_01", "MC_02", "MC_03"],
    detail:
      "Set mikrofon nirkabel dual-channel dengan receiver digital untuk suara vokal jernih dan bebas distorsi di berbagai kegiatan seminar dan presentasi.",
    spesifikasi: [
      "Frekuensi: UHF Digital 600-690 MHz",
      "Jangkauan Operasi: Hingga 50 meter",
      "Baterai: 2x AA per mikrofon",
      "Output: XLR Balanced & 6.35mm Jack",
      "Fitur: Noise Reduction & Auto Pairing",
    ],
  },
  {
    id: "e-14",
    nama: "Sound",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E4.png",
    kodeBarang: "SD_03",
    kodeList: ["SD_01", "SD_02", "SD_03"],
    detail:
      "Speaker portable aktif multifungsi dengan daya output tinggi, bass bertenaga, dan kemudahan koneksi bluetooth untuk ruangan besar.",
    spesifikasi: [
      "Daya Output: 150 Watt RMS",
      "Ukuran Woofer: 8 Inch",
      "Koneksi: Bluetooth 5.0, USB, AUX, Mic In",
      "Daya Tahan Baterai: Hingga 8 jam",
      "Bobot: 6.5 kg dengan handle ergonomis",
    ],
  },
  {
    id: "e-15",
    nama: "Camera",
    kategori: "ELEKTRONIK",
    gambar: "/images/Barang E5.png",
    kodeBarang: "CM_03",
    kodeList: ["CM_01", "CM_02", "CM_03"],
    detail:
      "Kamera saku digital profesional dengan sensor gambar beresolusi tinggi dan zoom optik fleksibel untuk dokumentasi kegiatan kampus.",
    spesifikasi: [
      "Resolusi Sensor: 20.1 Megapixel",
      "Video: Full HD 1080p @ 60fps",
      "Optical Zoom: 4.2x Optical Zoom",
      "Layar: 3.0 inch Tilt LCD Touchscreen",
      "Konektivitas: Wi-Fi, NFC, Micro-HDMI",
    ],
  },

  // ── FURNITUR ────────────────────────────────────────────────
  {
    id: "f-1",
    nama: "Layar Proyektor",
    kategori: "FURNITUR",
    gambar: "/images/Barang F1.png",
    kodeBarang: "LP_01",
    kodeList: ["LP_01", "LP_02", "LP_03"],
    detail:
      "Layar proyektor portabel model tripod dengan permukaan matte white yang menghasilkan pantulan gambar cerah dan merata dari sudut manapun.",
    spesifikasi: [
      "Ukuran Layar: 70 x 70 inch (178 x 178 cm)",
      "Bahan Layar: Matte White Fabric",
      "Tipe Dudukan: Tripod Besi Kokoh",
      "Fitur: Ketinggian dapat diatur",
      "Portabilitas: Mudah dilipat dan dibawa",
    ],
  },
  {
    id: "f-2",
    nama: "Meja Bulat",
    kategori: "FURNITUR",
    gambar: "/images/Barang F2.png",
    kodeBarang: "MB_01",
    kodeList: ["MB_01", "MB_02", "MB_03"],
    detail:
      "Meja bundar serbaguna dengan permukaan kayu serat halus dan kaki silang baja kokoh, ideal untuk diskusi santai dan ruang tunggu.",
    spesifikasi: [
      "Diameter: 90 cm",
      "Tinggi: 75 cm",
      "Bahan Daun Meja: MDF dilapisi Melamine",
      "Bahan Kaki: Baja finishing powder coating",
      "Kapasitas: 4-5 Orang",
    ],
  },
  {
    id: "f-3",
    nama: "Kursi Merah",
    kategori: "FURNITUR",
    gambar: "/images/Barang F3.png",
    kodeBarang: "KM_01",
    kodeList: ["KM_01", "KM_02", "KM_03", "KM_04"],
    detail:
      "Kursi susun empuk berbalut kain merah berkualitas dengan rangka besi chrome tebal, tahan lama untuk ruang rapat dan aula pertemuan.",
    spesifikasi: [
      "Material Rangka: Pipa besi finishing Chrome",
      "Bahan Jok: Busa cetak density tinggi",
      "Kain Pelapis: Fabric tenun merah tahan aus",
      "Dimensi: 42 x 48 x 85 cm",
      "Daya Beban: Hingga 120 kg",
    ],
  },
  {
    id: "f-4",
    nama: "Kursi Kayu",
    kategori: "FURNITUR",
    gambar: "/images/Barang F4.png",
    kodeBarang: "KK_01",
    kodeList: ["KK_01", "KK_02", "KK_03", "KK_04"],
    detail:
      "Kursi belajar berdesain klasik dengan dudukan dan sandaran kayu lapis natural serta rangka pipa baja abu-abu yang kokoh.",
    spesifikasi: [
      "Bahan Sandaran & Dudukan: Plywood Vernis Natural",
      "Bahan Rangka: Pipa baja persegi",
      "Dimensi: 40 x 40 x 80 cm",
      "Fitur: Pelindung kaki karet anti-gores",
      "Karakteristik: Ringan, kokoh, dan awet",
    ],
  },
  {
    id: "f-5",
    nama: "Meja",
    kategori: "FURNITUR",
    gambar: "/images/Barang F5.png",
    kodeBarang: "MJ_01",
    kodeList: ["MJ_01", "MJ_02", "MJ_03"],
    detail:
      "Meja kelas individual berukuran ergonomis dilengkapi rak penyimpanan buku di bawah meja dan rangka besi kokoh.",
    spesifikasi: [
      "Dimensi: 70 x 50 x 75 cm",
      "Bahan Top Table: Particle board laminasi motif kayu",
      "Rangka: Besi hollow tebal anti-karat",
      "Fitur: Rak buku bawah & gantungan tas samping",
      "Warna: Kayu natural dan abu-abu",
    ],
  },
  // Baris 2 Furnitur
  {
    id: "f-6",
    nama: "Layar Proyektor",
    kategori: "FURNITUR",
    gambar: "/images/Barang F1.png",
    kodeBarang: "LP_02",
    kodeList: ["LP_01", "LP_02", "LP_03"],
    detail:
      "Layar proyektor portabel model tripod dengan permukaan matte white yang menghasilkan pantulan gambar cerah dan merata dari sudut manapun.",
    spesifikasi: [
      "Ukuran Layar: 70 x 70 inch (178 x 178 cm)",
      "Bahan Layar: Matte White Fabric",
      "Tipe Dudukan: Tripod Besi Kokoh",
      "Fitur: Ketinggian dapat diatur",
      "Portabilitas: Mudah dilipat dan dibawa",
    ],
  },
  {
    id: "f-7",
    nama: "Meja Bulat",
    kategori: "FURNITUR",
    gambar: "/images/Barang F2.png",
    kodeBarang: "MB_02",
    kodeList: ["MB_01", "MB_02", "MB_03"],
    detail:
      "Meja bundar serbaguna dengan permukaan kayu serat halus dan kaki silang baja kokoh, ideal untuk diskusi santai dan ruang tunggu.",
    spesifikasi: [
      "Diameter: 90 cm",
      "Tinggi: 75 cm",
      "Bahan Daun Meja: MDF dilapisi Melamine",
      "Bahan Kaki: Baja finishing powder coating",
      "Kapasitas: 4-5 Orang",
    ],
  },
  {
    id: "f-8",
    nama: "Kursi Merah",
    kategori: "FURNITUR",
    gambar: "/images/Barang F3.png",
    kodeBarang: "KM_02",
    kodeList: ["KM_01", "KM_02", "KM_03"],
    detail:
      "Kursi susun empuk berbalut kain merah berkualitas dengan rangka besi chrome tebal, tahan lama untuk ruang rapat dan aula pertemuan.",
    spesifikasi: [
      "Material Rangka: Pipa besi finishing Chrome",
      "Bahan Jok: Busa cetak density tinggi",
      "Kain Pelapis: Fabric tenun merah tahan aus",
      "Dimensi: 42 x 48 x 85 cm",
      "Daya Beban: Hingga 120 kg",
    ],
  },
  {
    id: "f-9",
    nama: "Kursi Kayu",
    kategori: "FURNITUR",
    gambar: "/images/Barang F4.png",
    kodeBarang: "KK_02",
    kodeList: ["KK_01", "KK_02", "KK_03"],
    detail:
      "Kursi belajar berdesain klasik dengan dudukan dan sandaran kayu lapis natural serta rangka pipa baja abu-abu yang kokoh.",
    spesifikasi: [
      "Bahan Sandaran & Dudukan: Plywood Vernis Natural",
      "Bahan Rangka: Pipa baja persegi",
      "Dimensi: 40 x 40 x 80 cm",
      "Fitur: Pelindung kaki karet anti-gores",
      "Karakteristik: Ringan, kokoh, dan awet",
    ],
  },
  {
    id: "f-10",
    nama: "Meja",
    kategori: "FURNITUR",
    gambar: "/images/Barang F5.png",
    kodeBarang: "MJ_02",
    kodeList: ["MJ_01", "MJ_02", "MJ_03"],
    detail:
      "Meja kelas individual berukuran ergonomis dilengkapi rak penyimpanan buku di bawah meja dan rangka besi kokoh.",
    spesifikasi: [
      "Dimensi: 70 x 50 x 75 cm",
      "Bahan Top Table: Particle board laminasi motif kayu",
      "Rangka: Besi hollow tebal anti-karat",
      "Fitur: Rak buku bawah & gantungan tas samping",
      "Warna: Kayu natural dan abu-abu",
    ],
  },
  // Baris 3 Furnitur
  {
    id: "f-11",
    nama: "Layar Proyektor",
    kategori: "FURNITUR",
    gambar: "/images/Barang F1.png",
    kodeBarang: "LP_03",
    kodeList: ["LP_01", "LP_02", "LP_03"],
    detail:
      "Layar proyektor portabel model tripod dengan permukaan matte white yang menghasilkan pantulan gambar cerah dan merata dari sudut manapun.",
    spesifikasi: [
      "Ukuran Layar: 70 x 70 inch (178 x 178 cm)",
      "Bahan Layar: Matte White Fabric",
      "Tipe Dudukan: Tripod Besi Kokoh",
      "Fitur: Ketinggian dapat diatur",
      "Portabilitas: Mudah dilipat dan dibawa",
    ],
  },
  {
    id: "f-12",
    nama: "Meja Bulat",
    kategori: "FURNITUR",
    gambar: "/images/Barang F2.png",
    kodeBarang: "MB_03",
    kodeList: ["MB_01", "MB_02", "MB_03"],
    detail:
      "Meja bundar serbaguna dengan permukaan kayu serat halus dan kaki silang baja kokoh, ideal untuk diskusi santai dan ruang tunggu.",
    spesifikasi: [
      "Diameter: 90 cm",
      "Tinggi: 75 cm",
      "Bahan Daun Meja: MDF dilapisi Melamine",
      "Bahan Kaki: Baja finishing powder coating",
      "Kapasitas: 4-5 Orang",
    ],
  },
  {
    id: "f-13",
    nama: "Kursi Merah",
    kategori: "FURNITUR",
    gambar: "/images/Barang F3.png",
    kodeBarang: "KM_03",
    kodeList: ["KM_01", "KM_02", "KM_03"],
    detail:
      "Kursi susun empuk berbalut kain merah berkualitas dengan rangka besi chrome tebal, tahan lama untuk ruang rapat dan aula pertemuan.",
    spesifikasi: [
      "Material Rangka: Pipa besi finishing Chrome",
      "Bahan Jok: Busa cetak density tinggi",
      "Kain Pelapis: Fabric tenun merah tahan aus",
      "Dimensi: 42 x 48 x 85 cm",
      "Daya Beban: Hingga 120 kg",
    ],
  },
  {
    id: "f-14",
    nama: "Kursi Kayu",
    kategori: "FURNITUR",
    gambar: "/images/Barang F4.png",
    kodeBarang: "KK_03",
    kodeList: ["KK_01", "KK_02", "KK_03"],
    detail:
      "Kursi belajar berdesain klasik dengan dudukan dan sandaran kayu lapis natural serta rangka pipa baja abu-abu yang kokoh.",
    spesifikasi: [
      "Bahan Sandaran & Dudukan: Plywood Vernis Natural",
      "Bahan Rangka: Pipa baja persegi",
      "Dimensi: 40 x 40 x 80 cm",
      "Fitur: Pelindung kaki karet anti-gores",
      "Karakteristik: Ringan, kokoh, dan awet",
    ],
  },
  {
    id: "f-15",
    nama: "Meja",
    kategori: "FURNITUR",
    gambar: "/images/Barang F5.png",
    kodeBarang: "MJ_03",
    kodeList: ["MJ_01", "MJ_02", "MJ_03"],
    detail:
      "Meja kelas individual berukuran ergonomis dilengkapi rak penyimpanan buku di bawah meja dan rangka besi kokoh.",
    spesifikasi: [
      "Dimensi: 70 x 50 x 75 cm",
      "Bahan Top Table: Particle board laminasi motif kayu",
      "Rangka: Besi hollow tebal anti-karat",
      "Fitur: Rak buku bawah & gantungan tas samping",
      "Warna: Kayu natural dan abu-abu",
    ],
  },
];

