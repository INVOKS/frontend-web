import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { Peminjaman } from "@/lib/peminjaman-data";
import DetailRuangan from "./DetailRuangan";
import DetailBarang from "./DetailBarang";

type Props = {
  data: Peminjaman;
};

export default function PeminjamanCard({ data }: Props) {
  const isSelesai = data.status === "selesai";

  return (
    <article
      className={`rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col ${
        isSelesai ? "bg-white" : "bg-white"
      }`}
    >
      {/* ── Header nama ─────────────────────────────────────────── */}
      <div
        className={`px-5 py-3 ${
          isSelesai ? "bg-[#9E9E9E]" : "bg-[#FFC400]"
        }`}
      >
        <h3
          className={`text-base font-bold ${
            isSelesai ? "text-white" : "text-black"
          }`}
        >
          {data.namaPeminjam}
        </h3>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-5 flex flex-col gap-0">
        {/* Tanggal */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-700 w-14 mt-[2px] shrink-0">
            Tanggal
          </span>
          <span className="text-gray-400 text-xs mt-[2px] mr-1 shrink-0">:</span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 h-[26px] border border-gray-300 rounded-sm px-2 text-[11px] text-gray-700 bg-white">
              <FaCalendarAlt className="text-gray-400 text-[10px] shrink-0" />
              <span>{data.tanggalMulai}</span>
            </div>
            <div className="flex items-center gap-1.5 h-[26px] border border-gray-300 rounded-sm px-2 text-[11px] text-gray-700 bg-white">
              <FaCalendarAlt className="text-gray-400 text-[10px] shrink-0" />
              <span>{data.tanggalSelesai}</span>
            </div>
          </div>
        </div>

        {/* Waktu */}
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-gray-700 w-14 mt-[2px] shrink-0">
            Waktu
          </span>
          <span className="text-gray-400 text-xs mt-[2px] mr-1 shrink-0">:</span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 h-[26px] border border-gray-300 rounded-sm px-2 text-[11px] text-gray-700 bg-white">
              <FaClock className="text-gray-400 text-[10px] shrink-0" />
              <span>{data.waktuMulai}</span>
            </div>
            <div className="flex items-center gap-1.5 h-[26px] border border-gray-300 rounded-sm px-2 text-[11px] text-gray-700 bg-white">
              <FaClock className="text-gray-400 text-[10px] shrink-0" />
              <span>{data.waktuSelesai}</span>
            </div>
          </div>
        </div>

        {/* Detail section */}
        {data.detailRuangan && <DetailRuangan data={data.detailRuangan} />}
        {data.detailBarang && <DetailBarang items={data.detailBarang} />}
      </div>
    </article>
  );
}

