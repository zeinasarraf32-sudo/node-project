
import NavBar from '@/components/navbar/Navbar'; 
import Hero from "@/components/home/Hero";
import Footer from "@/components/home/Footer";
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <>
      <main>
        
         <Hero />
         <FAQ/>
         <Footer/>

      </main>
    </>
  );
}