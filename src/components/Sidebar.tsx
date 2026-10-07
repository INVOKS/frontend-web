"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBuilding,
  FaHome,
  FaInbox,
  FaShoppingBag,
  FaUserCircle,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: FaHome },
  { label: "Profil", href: "/profil", icon: FaUserCircle },
  { label: "Ruangan", href: "/ruangan", icon: FaBuilding },
  { label: "Barang", href: "/barang", icon: FaInbox },
  { label: "Kelola Peminjaman", href: "/kelola-peminjaman", icon: FaShoppingBag },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Placeholder aksi logout
    console.log("Logout clicked");
  };

  return (
    <aside className="sticky top-0 h-screen w-[274px] shrink-0 bg-sidebar text-white flex flex-col justify-between py-6 select-none">
      {/* Top Section: Logo & Navigasi */}
      <div>
        {/* Logo & Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-6 mb-8 focus:outline-none"
        >
          <div className="relative size-10 shrink-0 flex items-center justify-center">
            <Image
              src="/images/logoinvoks.png"
              alt="Logo INVOKS"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-bold tracking-widest uppercase">
            INVOKS
          </span>
        </Link>

        {/* Menu Navigasi */}
        <nav aria-label="Navigasi Admin" className="px-2.5">
          <ul className="flex flex-col gap-5">
            {navigationItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 h-[38px] px-4 rounded-lg text-lg font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-active border border-white/20"
                        : "border border-transparent hover:bg-white/10"
                    }`}
                  >
                    <Icon className="text-xl shrink-0" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section: Tombol Logout */}
      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors focus:outline-none"
        >
          <MdLogout className="text-2xl" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };