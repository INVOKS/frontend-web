"use client";

import Image from "next/image";

type HeaderTabsProps = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  avatarUrl?: string;
};

export default function HeaderTabs({
  tabs,
  active,
  onChange,
  avatarUrl = "/images/deddydieng.png",
}: HeaderTabsProps) {
  return (
    <header className="h-[84px] bg-navy flex items-center justify-between px-8 select-none">
      {/* Tabs Gedung */}
      <nav aria-label="Tab Gedung" className="h-full flex items-center gap-4">
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`relative h-full flex items-center px-5 text-lg font-bold uppercase transition-all duration-200 focus:outline-none cursor-pointer ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-[8px] bg-gray-400 transition-all duration-300 ease-out origin-center ${
                  isActive
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-50 pointer-events-none"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Admin Profile Info */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-white">
          Hello, <strong className="font-bold">Admin</strong>
        </span>
        <div className="relative size-[50px] shrink-0 rounded-full border-2 border-white overflow-hidden bg-white/20">
          <Image
            src={avatarUrl}
            alt="Avatar Admin"
            width={50}
            height={50}
            className="size-full object-cover rounded-full"
            priority
          />
        </div>
      </div>
    </header>
  );
}
