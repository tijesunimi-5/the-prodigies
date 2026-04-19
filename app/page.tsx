import HeroCurtain from '@/components/HeroCurtain';
import MeetFYB from '@/components/MeetFyb';
import NarrativeSection from '@/components/NarrativeSection';
import Footer from '@/components/Footer';
import SponsorSection from '@/components/SponsorSection';
import BrandMarquee from '@/components/BrandMarquee';
import TicketStatusFloat from '@/components/events/TicketStatusFloat';
import Navbar from '@/components/NavBar';

export default function LandingPage() {
  return (
    <main className="bg-[#F5E9DA] min-h-screen">
      <Navbar />
      {/* <Navbar /> */}
      <HeroCurtain />
      <NarrativeSection />
      <BrandMarquee />
      <MeetFYB />
      <SponsorSection />
      <TicketStatusFloat />
      <Footer />
    </main>
  );
}