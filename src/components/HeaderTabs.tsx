"use client";

import Image from "next/image";

type HeaderTabsProps = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export default function HeaderTabs({ tabs, active, onChange }: HeaderTabsProps) {
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
              className={`relative h-full flex items-center px-5 text-lg font-bold uppercase transition-colors focus:outline-none ${
                isActive ? "text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[8px] bg-gray-400" />
              )}
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
          {/* TODO: ganti dengan aset dari Figma */}
          <Image
            src="/images/avatar.jpg"
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
