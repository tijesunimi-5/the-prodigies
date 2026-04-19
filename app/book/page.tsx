"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Ticket, CheckCircle } from "lucide-react";
import Image from "next/image";
import RegistrationModal from "@/components/events/RegistrationModal";
import TicketStatusFloat from "@/components/events/TicketStatusFloat";
import Navbar from "@/components/NavBar";

const events = [
  {
    id: 1,
    title: "The Grand Dinner Night",
    date: "July 24th, 2026",
    time: "6:00 PM",
    location: "Living Spring Hall, Ibadan",
    price: "₦5,000",
    numericPrice: 5000,
    description: "An evening of fine dining, red carpet moments, and prophetic words. Dress code: Black Tie / Regal Gold.",
    image: "/dinner.jpg",
    available: 50,
  },
  {
    id: 2,
    title: "Casual Get-Together",
    date: "July 25th, 2026",
    time: "2:00 PM",
    location: "Agodi Gardens, Ibadan",
    price: "Free",
    numericPrice: 0,
    description: "Games, music, and deep conversations. A time to unwind and bond before we part ways.",
    image: "/hangout.jpg",
    available: 100,
  }
];

export default function BookPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReserved, setIsReserved] = useState<number[]>([]);

  const handleOpenRegistration = (event: typeof events[0]) => {
    if (event.numericPrice === 0) {
      // Free events logic
      setIsReserved([...isReserved, event.id]);
    } else {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Navbar />
        {/* Header Content... Same as before */}
        <header className="text-center mb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
            <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-bold">The Registry</span>
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#3B2A26]">Secure Your Seat.</h1>
        </header>

        <div className="space-y-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/40 backdrop-blur-md border border-[#3B2A26]/5 flex flex-col lg:flex-row overflow-hidden rounded-sm shadow-xl"
            >
              <div className="relative w-full lg:w-2/5 h-64 lg:h-auto overflow-hidden">
                <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-4 left-4 px-4 py-2 bg-[#3B2A26] text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                  {event.price}
                </div>
              </div>

              <div className="p-8 lg:p-12 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-serif text-[#3B2A26] mb-4">{event.title}</h2>
                  <p className="text-[#3B2A26]/60 text-sm leading-relaxed mb-8 max-w-lg italic font-sans">{event.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-[10px] uppercase tracking-widest"><Calendar size={14} className="text-[#D4AF37]" /> {event.date}</div>
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-[10px] uppercase tracking-widest"><Clock size={14} className="text-[#D4AF37]" /> {event.time}</div>
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-[10px] uppercase tracking-widest"><MapPin size={14} className="text-[#D4AF37]" /> {event.location}</div>
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-[10px] uppercase tracking-widest font-bold"><Users size={14} className="text-[#D4AF37]" /> {event.available} Slots Left</div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenRegistration(event)}
                  disabled={isReserved.includes(event.id)}
                  className="w-full sm:w-fit px-12 py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all flex items-center justify-center gap-3"
                >
                  {isReserved.includes(event.id) ? (
                    <> <CheckCircle size={14} /> Reservation Sent </>
                  ) : (
                    <> <Ticket size={14} /> {event.numericPrice === 0 ? "Reserve Spot" : "Book My Spot"} </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Logic */}
        <RegistrationModal
          key={selectedEvent?.id || 'none'} 
          isOpen={isModalOpen}
          onCloseAction={() => setIsModalOpen(false)}
          eventDetails={selectedEvent ? {
            title: selectedEvent.title,
            price: selectedEvent.price,
            numericPrice: selectedEvent.numericPrice
          } : null}
        />
        <TicketStatusFloat />
      </div>
    </main>
  );
}