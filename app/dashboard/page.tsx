"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import BookingCard, { type BookingWithDetails } from "@/components/BookingCard";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserName(
        user.user_metadata?.full_name || user.email?.split("@")[0] || "there"
      );

      const { data } = await supabase
        .from("bookings")
        .select("*, services(name, price, duration_minutes), available_slots(slot_date, start_time, end_time)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookings((data as BookingWithDetails[]) || []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold">
            Hey, <span className="text-gradient">{userName}</span>!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your bubble party bookings here.
          </p>
        </div>
        <Link href="/dashboard/book" className="btn-primary">
          Book New Event
        </Link>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <span className="text-5xl block mb-4">🫧</span>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No bookings yet!
          </h2>
          <p className="text-gray-400 mb-6">
            Ready to plan your first bubble party?
          </p>
          <Link href="/dashboard/book" className="btn-primary">
            Book Your First Event
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, i) => (
            <BookingCard key={booking.id} booking={booking} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
