import Navbar from "@/components/navbar/Navbar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
      {children}
    </>
  );
}