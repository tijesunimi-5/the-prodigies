"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Ticket, CheckCircle, Loader2, Tag } from "lucide-react";
import Image from "next/image";
import RegistrationModal from "@/components/events/RegistrationModal";
import TicketStatusFloat from "@/components/events/TicketStatusFloat";
import Navbar from "@/components/NavBar";

const baseEvents = [
  {
    id: 1,
    title: "The Grand Dinner Night",
    date: "July 20th, 2026",
    time: "4:00 PM",
    location: "Firebrand Model Parish Opp, Excel Hostel, Under G, Ogbomosho.",
    price: "₦4,000",
    numericPrice: 4000,
    description: "An evening of fine dining, red carpet moments, and prophetic words. Dress code: Black Tie / Regal Gold.",
    image: "/dinner-people.jpg",
    maxCapacity: 50,
  }
];

export default function BookPage() {
  const [events, setEvents] = useState(baseEvents.map(e => ({ ...e, available: e.maxCapacity })));
  const [selectedEvent, setSelectedEvent] = useState<typeof baseEvents[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReserved, setIsReserved] = useState<number[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Coupon handling client states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Live Slot Tracker Pipeline
  const syncLiveCapacityPools = useCallback(async () => {
    try {
      const res = await fetch("/api/tickets/live-capacity");
      if (res.ok) {
        const counts: Record<string, number> = await res.json();

        setEvents(baseEvents.map(event => {
          const claimedCount = counts[event.title] || 0;
          return {
            ...event,
            available: Math.max(0, event.maxCapacity - claimedCount)
          };
        }));
      }
    } catch (e) {
      console.error("Capacity sync failure:", e);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("prodigy_user_session");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user?.email) setUserEmail(user.email.toLowerCase().trim());
      } catch (e) {
        console.error("Failed to read context session rows:", e);
      }
    }
    syncLiveCapacityPools();
  }, [syncLiveCapacityPools]);

  const handleOpenBooking = (event: typeof baseEvents[0]) => {
    const activeUser = localStorage.getItem("prodigy_user_session");

    if (!activeUser) {
      alert("Authentication Required:\nPlease connect your secure Profile Pass before purchasing an entry ticket.");
      const triggerEvent = new CustomEvent("trigger-login");
      window.dispatchEvent(triggerEvent);
      return;
    }

    const currentEventState = events.find(e => e.id === event.id);
    if (currentEventState && currentEventState.available <= 0) {
      alert("Sold Out: This event has reached maximum capacity.");
      return;
    }

    if (event.numericPrice === 0) {
      setIsReserved([...isReserved, event.id]);
      alert(`Success! Your spot for ${event.title} has been reserved.`);
    } else {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleValidateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || isValidating) return;

    setCouponError(null);
    setIsValidating(true);

    const activeEmail = userEmail || JSON.parse(localStorage.getItem("prodigy_user_session") || "{}").email;

    if (!activeEmail) {
      setCouponError("Please sign into your pass to use coupon metrics.");
      setIsValidating(false);
      return;
    }

    try {
      const res = await fetch("/api/tickets/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, email: activeEmail })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setDiscountAmount(data.discountAmount);
        setAppliedCoupon(couponCode.toUpperCase().trim());
        setCouponError(null);
      } else {
        setCouponError(data.error || "Failed verifying discount properties.");
        setDiscountAmount(0);
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error("Coupon fetch exception:", err);
      setCouponError("Network server failure validating voucher rows.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError(null);
  };

  if (loadingSlots) {
    return (
      <div className="min-h-screen bg-[#F5E9DA] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#3B2A26]" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Navbar />

        <header className="text-center mb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
            <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-bold">The Registry</span>
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#3B2A26]">Secure Your Seat.</h1>
        </header>

        <div className="space-y-12">
          {events.map((event, index) => {
            const hasDiscount = event.numericPrice > 0 && discountAmount > 0;
            const liveComputedPrice = Math.max(0, event.numericPrice - discountAmount);
            const isSoldOut = event.available <= 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/40 backdrop-blur-md border border-[#3B2A26]/5 flex flex-col lg:flex-row overflow-hidden rounded-sm shadow-xl"
              >
                <div className="relative w-full lg:w-2/5 h-64 lg:h-auto overflow-hidden bg-stone-800">
                  {event.image && (
                    <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  )}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-[#3B2A26] text-[#D4AF37] text-xs font-bold uppercase tracking-widest flex flex-col items-start gap-0.5">
                    {isSoldOut ? (
                      <span className="text-red-400">Sold Out</span>
                    ) : hasDiscount ? (
                      <>
                        <span className="line-through text-white/50 text-[10px]">{event.price}</span>
                        <span>₦{liveComputedPrice.toLocaleString()}</span>
                      </>
                    ) : (
                      <span>{event.price}</span>
                    )}
                  </div>
                </div>

                <div className="p-8 lg:p-12 flex-1 flex flex-col justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-serif text-[#3B2A26] mb-4">{event.title}</h2>
                    <p className="text-[#3B2A26]/60 text-sm leading-relaxed mb-8 max-w-lg italic font-sans">{event.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                      <div className="flex items-center gap-3 text-[#3B2A26]/80 text-[10px] uppercase tracking-widest"><Calendar size={14} className="text-[#D4AF37]" /> {event.date}</div>
                      <div className="flex items-center gap-3 text-[#3B2A26]/80 text-[10px] uppercase tracking-widest"><Clock size={14} className="text-[#D4AF37]" /> {event.time}</div>
                      <div className="flex items-center gap-3 text-[#3B2A26]/80 text-[10px] uppercase tracking-widest"><MapPin size={14} className="text-[#D4AF37]" /> {event.location}</div>
                      <div className={`flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold ${isSoldOut ? 'text-red-600' : 'text-[#3B2A26]/80'}`}>
                        <Users size={14} className="text-[#D4AF37]" /> {event.available} Slots Left
                      </div>
                    </div>
                  </div>

                  {event.numericPrice > 0 && !isSoldOut && (
                    <div className="max-w-md border-t border-[#3B2A26]/10 pt-6 mb-2">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-sm px-4 py-3 text-green-800">
                          <div className="flex items-center gap-2.5">
                            <Tag size={14} className="text-green-600" />
                            <div>
                              <p className="text-[9px] uppercase font-black tracking-wider opacity-60">Voucher Added Successfully</p>
                              <p className="text-xs font-bold font-mono">{appliedCoupon} (-₦500 Value)</p>
                            </div>
                          </div>
                          <button type="button" onClick={handleRemoveCoupon} className="text-[10px] uppercase font-black tracking-wider opacity-50 hover:opacity-100 text-stone-900 transition-opacity cursor-pointer">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleValidateCoupon} className="space-y-2">
                          <label className="text-[9px] uppercase font-black text-[#3B2A26]/50 tracking-wider block">Have a ticket discount code?</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. PRDG-ABCD-EFGH"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="bg-black/5 text-[#3B2A26] border rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-[#D4AF37] tracking-widest uppercase flex-1"
                            />
                            <button
                              type="submit"
                              disabled={isValidating || !couponCode.trim()}
                              className="bg-[#3B2A26] text-[#F5E9DA] px-4 py-2 text-[9px] uppercase font-black tracking-widest rounded-sm hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-colors disabled:opacity-40 cursor-pointer shrink-0 flex items-center justify-center min-w-19"
                            >
                              {isValidating ? <Loader2 size={12} className="animate-spin" /> : "Apply"}
                            </button>
                          </div>
                          {couponError && (
                            <p className="text-[10px] text-red-700 font-bold tracking-wide font-sans">{couponError}</p>
                          )}
                        </form>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenBooking(event)}
                    disabled={isReserved.includes(event.id) || isSoldOut}
                    className="w-full sm:w-fit px-12 py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:bg-stone-400 disabled:cursor-not-allowed"
                  >
                    {isSoldOut ? (
                      "Event Full"
                    ) : isReserved.includes(event.id) ? (
                      <> <CheckCircle size={14} /> Reservation Sent </>
                    ) : (
                      <> <Ticket size={14} /> {event.numericPrice === 0 ? "Reserve Spot" : "Book My Spot"} </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <RegistrationModal
          key={selectedEvent?.id || 'none'}
          isOpen={isModalOpen}
          onCloseAction={() => {
            setIsModalOpen(false);
            syncLiveCapacityPools();
          }}
          eventDetails={selectedEvent ? {
            title: selectedEvent.title,
            price: discountAmount > 0 ? `₦${Math.max(0, selectedEvent.numericPrice - discountAmount).toLocaleString()}` : selectedEvent.price,
            numericPrice: Math.max(0, selectedEvent.numericPrice - discountAmount),
            appliedCoupon: appliedCoupon
          } : null}
        />
        <TicketStatusFloat />
      </div>
    </main>
  );
}