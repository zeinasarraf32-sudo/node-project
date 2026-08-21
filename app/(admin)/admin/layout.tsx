// app/admin/layout.tsx
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}