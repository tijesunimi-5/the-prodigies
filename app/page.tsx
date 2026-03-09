import HeroCurtain from '@/components/HeroCurtain';
import MeetFYB from '@/components/MeetFyb';
import NarrativeSection from '@/components/NarrativeSection';
import Footer from '@/components/Footer';
import SponsorSection from '@/components/SponsorSection';
import BrandMarquee from '@/components/BrandMarquee';

export default function LandingPage() {
  return (
    <main className="bg-[#F5E9DA] min-h-screen">
      {/* <Navbar /> */}
      <HeroCurtain />
      <NarrativeSection />
      <BrandMarquee />
      <MeetFYB />
      <SponsorSection />
      <Footer />
    </main>
  );
}