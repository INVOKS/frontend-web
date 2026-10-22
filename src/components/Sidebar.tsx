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
    label: "Profil",
    href: "/profil",
    icon: FaUserCircle,
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
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
<<<<<<< HEAD
    if (confirm("Apakah Anda yakin ingin keluar dari akun admin?")) {
      logout();
    }
=======
    console.log("Logout clicked");
>>>>>>> 25fc2e13262c1cd3eca9ad6b65841721d31e4fe8
  };

  return (
    <aside
      className="
        sticky
        top-0
        flex
        h-screen
        w-[274px]
        shrink-0
        select-none
        flex-col
        justify-between
        bg-[#193775]
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
          <div
            className="
              relative
              flex
              size-10
              shrink-0
              items-center
              justify-center
            "
          >
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
              font-bold
              uppercase
              tracking-widest
            "
          >
            INVOKS
          </span>
        </Link>

        {/* Navigation */}
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
                    className={`
                      flex
                      h-[42px]
                      items-center
                      gap-3
                      rounded-lg
                      border
                      px-4
                      text-base
                      font-medium
                      transition-colors
                      duration-200

                      ${
                        isActive
                          ? "border-white/20 bg-[#405A91]"
                          : "border-transparent hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon
                      className="shrink-0 text-xl"
                      aria-hidden="true"
                    />

                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-5
            py-2
            text-lg
            font-medium
            transition-colors
            duration-200
            hover:bg-white/10
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