import Image from "next/image";
import { PeminjamanBarangItem, StatusPeminjaman } from "@/lib/peminjaman-data";

type Props = {
  items: PeminjamanBarangItem[];
  statusCard?: StatusPeminjaman;
};

export default function DetailBarang({ items, statusCard }: Props) {
  const isSelesai = statusCard === "selesai";

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-gray-700 mb-1.5">Detail Barang</p>
      <div className="flex flex-col gap-2">
        {items.map((item, idx) => {
          // Tentukan warna badge jumlah berdasarkan status card dan status barang
          let badgeColorClass = "bg-white text-gray-700 border-gray-300";
          if (isSelesai) {
            if (item.statusPengembalian === "dikembalikan") {
              badgeColorClass = "bg-[#00C853] text-white border-[#00C853]";
            } else {
              badgeColorClass = "bg-[#D32F2F] text-white border-[#D32F2F]";
            }
          }

          return (
            <div key={idx} className="flex items-center gap-2">
              {/* timeline dot */}
              <div className="relative flex flex-col items-center self-stretch">
                <span className="mt-[9px] size-2 rounded-full bg-gray-500 shrink-0 z-10" />
                {idx < items.length - 1 && (
                  <span className="flex-1 w-px bg-gray-300 mt-0.5" />
                )}
              </div>

              {/* card */}
              <div className="flex items-center justify-between flex-1 border border-gray-300 rounded-sm px-2 py-1.5 bg-white mb-0.5">
                <div className="flex items-center gap-2">
                  <div className="relative size-[50px] shrink-0 overflow-hidden rounded-sm bg-gray-100">
                    <Image
                      src={item.gambar}
                      alt={item.nama}
                      fill
                      className="object-cover"
                      sizes="50px"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-800 leading-tight">
                      {item.nama}
                    </p>
                    <p className="text-[10px] text-gray-500">{item.kode}</p>
                  </div>
                </div>
                {/* jumlah badge */}
                <div
                  className={`flex items-center justify-center size-[26px] border rounded-sm text-[11px] font-semibold shrink-0 transition-colors ${badgeColorClass}`}
                >
                  {item.jumlah}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

