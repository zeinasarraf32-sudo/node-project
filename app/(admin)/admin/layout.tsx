'use client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { useState } from 'react';

import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 antialiased overflow-x-hidden">
        <AdminNavbar />

        {children}
      </div>
    </QueryClientProvider>
  );
}