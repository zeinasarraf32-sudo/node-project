import Link from "next/link";
import Hero from "@/components/home/Hero";
import AIAssistant from "@/components/home/AIAssistant";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>

      <Link href="/doctors">
        Find Doctors
      </Link>

      
    </div>
  );
}