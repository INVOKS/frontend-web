import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Sidebar />
			<main className="ml-[274px] min-h-screen">{children}</main>
		</div>
	);
}