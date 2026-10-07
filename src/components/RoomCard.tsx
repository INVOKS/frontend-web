import Image from "next/image";

type RoomCardProps = {
  name: string;          // "Ruang 101"
  capacityMin: number;   // 80
  capacityMax: number;   // 100
  imageUrl?: string;     // default "/images/ruangan.jpg"
};

export default function RoomCard({
  name,
  capacityMin,
  capacityMax,
  imageUrl = "/images/ruangan.jpg", // TODO: ganti dengan aset dari Figma jika diperlukan
}: RoomCardProps) {
  return (
    <div className="flex h-[195px] w-full flex-col items-center justify-center gap-3 rounded-sm bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
      <div className="relative h-[73px] w-[80px] shrink-0 overflow-hidden rounded-sm bg-gray-100">
        <Image
          src={imageUrl}
          alt={name}
          width={80}
          height={73}
          className="h-[73px] w-[80px] object-cover"
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-black">{name}</h3>
        <p className="mt-1 text-[10px] text-black">
          Kapasitas {capacityMin} - {capacityMax} orang
        </p>
      </div>
    </div>
  );
}