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
  imageUrl = "/images/ruangan.jpg",
}: RoomCardProps) {
  return (
    <div className="flex h-[225px] w-full flex-col items-center justify-center gap-3.5 rounded-md bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.16)]">
      <div className="relative h-[92px] w-[105px] shrink-0 overflow-hidden rounded-sm bg-gray-100 shadow-xs">
        <Image
          src={imageUrl}
          alt={name}
          width={105}
          height={92}
          className="size-full object-cover"
        />
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-black">{name}</h3>
        <p className="mt-1 text-xs text-neutral-700">
          Kapasitas {capacityMin} - {capacityMax} orang
        </p>
      </div>
    </div>
  );
}