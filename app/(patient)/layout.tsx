import "@/app/globals.css";
import Providers from "@/app/providers";
import Navbar from "@/components/navbar/Navbar"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased overflow-x-hidden">
        <Navbar />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}