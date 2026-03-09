import HeroCurtain from '@/components/HeroCurtain';
import ParallaxCollage from '@/components/ParallaxCollage';
import MeetFYB from '@/components/MeetFyb';
import Navbar from '@/components/NavBar';
import NarrativeSection from '@/components/NarrativeSection';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <main className="bg-[#F5E9DA] min-h-screen">
      <Navbar />
      <HeroCurtain />
      <NarrativeSection />
      <MeetFYB />
      <Footer />
    </main>
  );
}