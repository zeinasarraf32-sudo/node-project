'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased overflow-x-hidden">
        <QueryClientProvider client={queryClient}>
          <div>
            <AdminNavbar />
            {children}
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}