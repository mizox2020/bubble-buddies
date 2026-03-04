"use client";

import { motion } from "framer-motion";

export interface BookingWithDetails {
  id: string;
  status: string;
  event_address: string | null;
  guest_count: number;
  notes: string | null;
  created_at: string;
  services: { name: string; price: number; duration_minutes: number } | null;
  available_slots: { slot_date: string; start_time: string; end_time: string } | null;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-brand-blue-soft text-brand-blue",
};

export default function BookingCard({
  booking,
  index,
}: {
  booking: BookingWithDetails;
  index: number;
}) {
  const slot = booking.available_slots;
  const service = booking.services;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-gray-800">
            {service?.name ?? "Party"}
          </h3>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
              statusStyles[booking.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          {slot && (
            <>
              <span>
                {new Date(slot.slot_date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>
                {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
              </span>
            </>
          )}
          {booking.guest_count > 0 && (
            <span>{booking.guest_count} guests</span>
          )}
        </div>

        {booking.event_address && (
          <p className="text-xs text-gray-400 mt-1">{booking.event_address}</p>
        )}
      </div>

      {service && (
        <div className="text-right">
          <span className="text-lg font-bold text-gradient">${service.price}</span>
        </div>
      )}
    </motion.div>
  );
}
