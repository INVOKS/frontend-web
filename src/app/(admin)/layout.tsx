"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AdminAuthGuard from "@/components/AdminAuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isUbahKataSandi = pathname?.includes("/ubah-kata-sandi");

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        {!isUbahKataSandi && <Sidebar />}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
