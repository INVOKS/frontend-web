import Sidebar from "@/components/Sidebar";
import AdminAuthGuard from "@/components/AdminAuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}