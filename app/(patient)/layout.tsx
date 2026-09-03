import "@/app/globals.css";
import Providers from "@/app/providers";
import Navbar from "@/components/navbar/Navbar"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
     <>
        <Navbar />
        <Providers>
          {children}
        </Providers>
  
   </>
  );
}