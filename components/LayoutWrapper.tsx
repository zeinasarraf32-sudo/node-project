'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <body className="min-h-full flex flex-col bg-slate-50 text-gray-900 antialiased">
      {!isLoginPage && <Navbar />}
      
      {/* Container wraps content with max-width, centers it, and adds side margins */}
      <main
        className={
          isLoginPage
            ? 'w-full flex-1'
            : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1'
        }
      >
        {children}
      </main>
    </body>
  );
}