import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/home/Hero";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main >
        <Hero />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}