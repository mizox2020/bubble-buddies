"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { "en-US": enUS } });

interface Assignment {
  id: string;
  status: string;
  event_address: string | null;
  guest_count: number;
  notes: string | null;
  services: { name: string } | null;
  available_slots: { slot_date: string; start_time: string; end_time: string } | null;
  profiles: { full_name: string | null } | null;
}

interface CalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Assignment;
}

const statusColor: Record<string, string> = {
  pending: "#fbbf24",
  confirmed: "#34d399",
  cancelled: "#f87171",
  completed: "#45B7D1",
};

export default function StaffCalendarPage() {
  const router = useRouter();
  const supabase = createClient();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState<CalEvent | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

    let query = supabase
      .from("bookings")
      .select("*, profiles!bookings_user_id_fkey(full_name), services(name), available_slots(slot_date, start_time, end_time)")
      .order("created_at", { ascending: false });

    if (profile?.role !== "admin") {
      query = query.eq("assigned_user_id", user.id);
    }

    const { data } = await query;
    setAssignments((data as unknown as Assignment[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const events: CalEvent[] = useMemo(() =>
    assignments
      .filter((a) => a.available_slots)
      .map((a) => {
        const s = a.available_slots!;
        return {
          id: a.id,
          title: `${a.services?.name ?? "Event"} — ${a.profiles?.full_name ?? "Customer"}`,
          start: new Date(`${s.slot_date}T${s.start_time}`),
          end: new Date(`${s.slot_date}T${s.end_time}`),
          resource: a,
        };
      }),
    [assignments]
  );

  const eventStyleGetter = (event: CalEvent) => ({
    style: {
      backgroundColor: statusColor[event.resource.status] || "#a78bfa",
      borderRadius: "8px",
      border: "none",
      color: "#fff",
      fontSize: "12px",
      padding: "2px 6px",
    },
  });

  if (loading) return <div className="text-center py-20 text-gray-400">Loading calendar...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-2xl">📅</span>
        <h1 className="text-2xl font-extrabold text-gradient">My Calendar</h1>
        <button onClick={() => router.back()} className="ml-auto text-xs text-gray-500 hover:text-brand-pink transition-colors">
          &larr; Go Back
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(statusColor).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{status}</span>
          </div>
        ))}
      </div>

      <div className="card border border-gray-100 p-4 overflow-auto" style={{ minHeight: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onSelectEvent={(e) => setSelected(e)}
          eventPropGetter={eventStyleGetter}
          style={{ height: 600 }}
          views={["month", "week", "day", "agenda"]}
          popup
        />
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-gray-800">{selected.resource.services?.name ?? "Event"}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium capitalize" style={{ color: statusColor[selected.resource.status] }}>
                  {selected.resource.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Customer</span>
                <span className="font-medium">{selected.resource.profiles?.full_name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium">{format(selected.start, "EEEE, MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span className="font-medium">{format(selected.start, "h:mm a")} – {format(selected.end, "h:mm a")}</span>
              </div>
              {selected.resource.event_address && (
                <div className="flex justify-between">
                  <span>Address</span>
                  <span className="font-medium text-right max-w-[200px]">{selected.resource.event_address}</span>
                </div>
              )}
              {selected.resource.guest_count > 0 && (
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span className="font-medium">{selected.resource.guest_count}</span>
                </div>
              )}
              {selected.resource.notes && (
                <div>
                  <span className="block text-gray-400 text-xs mb-1">Notes</span>
                  <p className="text-sm bg-gray-50 rounded-lg p-2">{selected.resource.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
