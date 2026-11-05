import { DetailRuanganData } from "@/lib/peminjaman-data";

type Props = {
  data: DetailRuanganData;
};

export default function DetailRuangan({ data }: Props) {
  const rows: { label: string; value: string }[] = [
    { label: "Gedung", value: data.gedung },
    { label: "Ruang", value: data.ruang },
    { label: "Lantai", value: data.lantai },
    { label: "Kapasitas", value: data.kapasitas },
    { label: "Nama kegiatan", value: data.namaKegiatan },
  ];

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-gray-700 mb-1.5">Detail Ruangan</p>
      <div className="border border-gray-300 rounded-sm px-3 py-2 bg-white text-[11px] text-gray-800">
        <table className="w-full border-collapse">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label}>
                <td className="py-[1px] pr-1 whitespace-nowrap align-top font-normal w-[90px]">
                  {label}
                </td>
                <td className="py-[1px] px-1 align-top w-3">:</td>
                <td className="py-[1px] align-top">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

