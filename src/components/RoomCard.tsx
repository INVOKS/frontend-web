"use client";

import Image from "next/image";

type RoomCardProps = {
  name: string;          // "Ruang 101"
  capacityMin: number;   // 80
  capacityMax: number;   // 100
  imageUrl?: string;     // default "/images/ruangan.jpg"
  onClick?: () => void;
};

export default function RoomCard({
  name,
  capacityMin,
  capacityMax,
  imageUrl = "/images/ruangan.jpg",
  onClick,
}: RoomCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Lihat detail ${name}`}
      className="group flex h-[225px] w-full cursor-pointer flex-col items-center justify-center gap-3.5 rounded-md bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar"
    >
      <div className="relative h-[92px] w-[105px] shrink-0 overflow-hidden rounded-sm bg-gray-100 shadow-xs">
        <Image
          src={imageUrl}
          alt={name}
          width={105}
          height={92}
          className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-black transition-colors group-hover:text-sidebar">
          {name}
        </h3>
        <p className="mt-1 text-xs text-neutral-700">
          Kapasitas {capacityMin} - {capacityMax} orang
        </p>
      </div>
    </div>
  );
}