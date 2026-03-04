"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface BookingRow {
  id: string;
  status: string;
  event_address: string | null;
  guest_count: number;
  notes: string | null;
  assigned_user_id: string | null;
  answers: Record<string, unknown> | null;
  created_at: string;
  profiles: { full_name: string | null } | null;
  services: { name: string; price: number } | null;
  available_slots: { slot_date: string; start_time: string; end_time: string } | null;
}

interface Question { id: string; label: string; type: string; }

interface StaffUser {
  id: string;
  full_name: string | null;
}

const STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;
const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-brand-blue-soft text-brand-blue",
};

export default function AdminBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [bookingsRes, staffRes, qRes] = await Promise.all([
      supabase
        .from("bookings")
        .select("*, profiles!bookings_user_id_fkey(full_name), services(name, price), available_slots(slot_date, start_time, end_time)")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
      supabase.from("booking_questions").select("id, label, type").order("sort_order"),
    ]);
    setBookings((bookingsRes.data as unknown as BookingRow[]) || []);
    setStaff((staffRes.data as StaffUser[]) || []);
    setQuestions((qRes.data as Question[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const updateBooking = async (id: string, updates: Record<string, unknown>) => {
    await supabase.from("bookings").update(updates).eq("id", id);
    load();
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading bookings...</div>;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              filter === s ? "bg-brand-gradient text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {s} ({s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="card border border-gray-100 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 truncate">{b.services?.name ?? "—"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[b.status] || ""}`}>
                      {b.status}
                    </span>
                    {b.answers && Object.keys(b.answers).length > 0 && (
                      <button
                        onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                        className="text-[10px] text-brand-blue hover:underline"
                      >
                        {expanded === b.id ? "Hide details" : "View details"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-xs text-gray-500">
                    <span>Customer: {b.profiles?.full_name || "—"}</span>
                    {b.available_slots && (
                      <span>
                        {new Date(b.available_slots.slot_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                        {b.available_slots.start_time.slice(0, 5)}–{b.available_slots.end_time.slice(0, 5)}
                      </span>
                    )}
                    {b.event_address && <span className="truncate max-w-[200px]">{b.event_address}</span>}
                    {b.guest_count > 0 && <span>{b.guest_count} guests</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={b.status}
                    onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-brand-pink/30"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <select
                    value={b.assigned_user_id || ""}
                    onChange={(e) => updateBooking(b.id, { assigned_user_id: e.target.value || null })}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-brand-pink/30 max-w-[140px]"
                  >
                    <option value="">Unassigned</option>
                    {staff.map((u) => (
                      <option key={u.id} value={u.id}>{u.full_name || u.id.slice(0, 8)}</option>
                    ))}
                  </select>

                  {b.services && (
                    <span className="text-sm font-bold text-gradient">${b.services.price}</span>
                  )}
                </div>
              </div>

              {/* Expanded answers */}
              {expanded === b.id && b.answers && (
                <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(b.answers).map(([qId, val]) => {
                    const q = questions.find((q) => q.id === qId);
                    if (!q) return null;
                    return (
                      <div key={qId} className="flex items-center gap-2 text-xs">
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${val ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {q.type === "checkbox" ? (val ? "✓" : "✕") : "—"}
                        </span>
                        <span className="text-gray-600">{q.label}</span>
                        {q.type !== "checkbox" && <span className="font-medium text-gray-800 ml-auto">{String(val)}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
