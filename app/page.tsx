import HeroCurtain from '@/components/HeroCurtain';
import ParallaxCollage from '@/components/ParallaxCollage';
import MeetFYB from '@/components/MeetFyb';
import Navbar from '@/components/NavBar';
import NarrativeSection from '@/components/NarrativeSection';

export default function LandingPage() {
  return (
    <main className="bg-[#F5E9DA] min-h-screen">
      <Navbar />
      <HeroCurtain />
      <NarrativeSection />
      <ParallaxCollage />
      <MeetFYB />

      <footer className="py-24 bg-[#3B2A26] text-[#F5E9DA] text-center">
        <p className="font-serif text-3xl tracking-widest opacity-80 mb-6">THE PRODIGIES</p>
        <div className="w-16 h-1px bg-[#D4AF37] mx-auto mb-6" />
        <p className="text-[10px] tracking-[0.5em] uppercase opacity-40">
          Crafted for Excellence • Since 2022
        </p>
      </footer>
    </main>
  );
}