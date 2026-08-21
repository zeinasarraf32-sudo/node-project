// app/layout.tsx
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}