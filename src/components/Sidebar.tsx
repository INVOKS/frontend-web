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
import { logout } from "@/lib/auth";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: FaHome,
  },
  {
    label: "Ruangan",
    href: "/ruangan",
    icon: FaBuilding,
  },
  {
    label: "Barang",
    href: "/barang",
    icon: FaInbox,
  },
  {
    label: "Kelola Peminjaman",
    href: "/kelola-peminjaman",
    icon: FaShoppingBag,
  },
  {
    label: "Profil",
    href: "/profil",
    icon: FaUserCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun admin?")) {
      logout();
    }
  };

  return (
    <aside
      className="
        sticky
        top-0
        flex
        h-screen
        w-[245px]
        shrink-0
        select-none
        flex-col
        justify-between
        bg-[#025D96]
        py-6
        text-white
      "
    >
      {/* Top Section */}
      <div>
        {/* Logo & Brand */}
        <Link
          href="/dashboard"
          className="
            mb-8
            flex
            items-center
            gap-3
            px-6
            focus:outline-none
          "
        >
          <div className="relative flex size-10 shrink-0 items-center justify-center">
            <Image
              src="/images/logoinvoks.png"
              alt="Logo INVOKS"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          <span
            className="
              text-2xl
              font-extrabold
              uppercase
              tracking-wider
            "
          >
            INVOKS
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Navigasi Admin" className="px-3.5">
          <ul className="flex flex-col gap-3">
            {navigationItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      flex
                      h-[44px]
                      items-center
                      gap-3.5
                      rounded-[10px]
                      px-4
                      text-[15px]
                      font-semibold
                      transition-all
                      duration-150

                      ${
                        isActive
                          ? "border border-white/40 bg-white/15 text-white shadow-xs"
                          : "border border-transparent text-white/90 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      className="shrink-0 text-xl"
                      aria-hidden="true"
                    />

                    <span className="whitespace-nowrap">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6 pb-2">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2.5
            rounded-lg
            py-2
            text-base
            font-bold
            text-white
            transition-colors
            duration-150
            hover:text-white/80
            focus:outline-none
          "
        >
          <MdLogout
            className="text-2xl"
            aria-hidden="true"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
