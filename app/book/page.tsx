"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Ticket, CheckCircle } from "lucide-react";
import Image from "next/image";

const events = [
  {
    id: 1,
    title: "The Grand Dinner Night",
    date: "July 24th, 2026",
    time: "6:00 PM",
    location: "Living Spring Hall, Ibadan",
    price: "₦5,000",
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
    description: "Games, music, and deep conversations. A time to unwind and bond before we part ways.",
    image: "/hangout.jpg",
    available: 100,
  }
];

export default function BookPage() {
  const [bookingStatus, setBookingStatus] = useState<number | null>(null);

  const handleBook = (id: number) => {
    // Logic for database/WhatsApp integration goes here
    setBookingStatus(id);
    setTimeout(() => setBookingStatus(null), 3000);
  };

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="text-center mb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
            <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-bold">Reservations</span>
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#3B2A26]">Secure Your Seat.</h1>
          <p className="mt-6 text-[#3B2A26]/60 font-sans italic max-w-xl mx-auto">
            Join us for a series of unforgettable moments as we celebrate our transition into the next phase.
          </p>
        </header>

        {/* Events List */}
        <div className="space-y-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/40 backdrop-blur-md border border-[#3B2A26]/5 flex flex-col lg:flex-row overflow-hidden rounded-sm shadow-xl"
            >
              {/* Image Side */}
              <div className="relative w-full lg:w-2/5 h-64 lg:h-auto overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 px-4 py-2 bg-[#3B2A26] text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                  {event.price}
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 lg:p-12 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-serif text-[#3B2A26] mb-4">{event.title}</h2>
                  <p className="text-[#3B2A26]/60 text-sm leading-relaxed mb-8 max-w-lg italic">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-xs uppercase tracking-widest">
                      <Calendar size={16} className="text-[#D4AF37]" /> {event.date}
                    </div>
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-xs uppercase tracking-widest">
                      <Clock size={16} className="text-[#D4AF37]" /> {event.time}
                    </div>
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-xs uppercase tracking-widest">
                      <MapPin size={16} className="text-[#D4AF37]" /> {event.location}
                    </div>
                    <div className="flex items-center gap-3 text-[#3B2A26]/80 text-xs uppercase tracking-widest font-bold">
                      <Users size={16} className="text-[#D4AF37]" /> {event.available} Slots Left
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBook(event.id)}
                  disabled={bookingStatus === event.id}
                  className="w-full sm:w-fit px-12 py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all flex items-center justify-center gap-3"
                >
                  {bookingStatus === event.id ? (
                    <> <CheckCircle size={14} /> Reservation Sent </>
                  ) : (
                    <> <Ticket size={14} /> Book My Spot </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Policy Section */}
        <div className="mt-24 p-8 border-t border-[#3B2A26]/10 text-center">
          <p className="text-[10px] text-[#3B2A26]/40 uppercase tracking-[0.5em] mb-4">Important Notice</p>
          <p className="max-w-2xl mx-auto text-xs text-[#3B2A26]/60 leading-relaxed font-sans">
            Please note that reservations are confirmed on a first-come, first-served basis.
            For events with prices, payment details will be sent to your registered WhatsApp number upon booking.
          </p>
        </div>
      </div>
    </main>
  );
}