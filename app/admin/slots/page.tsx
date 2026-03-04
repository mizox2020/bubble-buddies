"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Slot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export default function AdminSlotsPage() {
  const supabase = createClient();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: "", start: "09:00", end: "11:00" });
  const [bulkDays, setBulkDays] = useState("7");
  const [bulkTimes, setBulkTimes] = useState("09:00,11:00,13:00,15:00");
  const [showBulk, setShowBulk] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("available_slots")
      .select("*")
      .gte("slot_date", new Date().toISOString().split("T")[0])
      .order("slot_date")
      .order("start_time");
    setSlots((data as Slot[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const addSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("available_slots").insert({
      slot_date: form.date,
      start_time: form.start,
      end_time: form.end,
    });
    setForm({ ...form, date: "" });
    setSaving(false);
    load();
  };

  const bulkCreate = async () => {
    setSaving(true);
    const days = parseInt(bulkDays);
    const times = bulkTimes.split(",").map((t) => t.trim()).filter(Boolean);
    const inserts: { slot_date: string; start_time: string; end_time: string }[] = [];
    const today = new Date();

    for (let i = 1; i <= days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      for (const time of times) {
        const [h, m] = time.split(":").map(Number);
        const endH = h + 2;
        inserts.push({
          slot_date: dateStr,
          start_time: time,
          end_time: `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        });
      }
    }

    await supabase.from("available_slots").insert(inserts);
    setSaving(false);
    setShowBulk(false);
    load();
  };

  const deleteSlot = async (id: string) => {
    await supabase.from("available_slots").delete().eq("id", id);
    load();
  };

  const grouped = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    const key = s.slot_date;
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Single slot form */}
        <form onSubmit={addSlot} className="flex items-end gap-2 flex-wrap">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start</label>
            <input
              required type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End</label>
            <input
              required type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-xs disabled:opacity-50">Add Slot</button>
        </form>

        <button
          onClick={() => setShowBulk(!showBulk)}
          className="btn-secondary text-xs self-end"
        >
          {showBulk ? "Hide" : "Bulk Create"}
        </button>
      </div>

      {showBulk && (
        <div className="card border border-gray-100 mb-6 space-y-3">
          <h3 className="font-semibold text-sm text-gray-700">Bulk Create Slots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Days ahead</label>
              <input
                type="number" min="1" max="60" value={bulkDays} onChange={(e) => setBulkDays(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start times (comma separated)</label>
              <input
                value={bulkTimes} onChange={(e) => setBulkTimes(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
                placeholder="09:00,11:00,13:00,15:00"
              />
            </div>
          </div>
          <button onClick={bulkCreate} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
            {saving ? "Creating..." : "Create Slots"}
          </button>
        </div>
      )}

      {/* Slots by date */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-gray-400 py-10">No upcoming slots.</p>
      ) : (
        Object.entries(grouped).map(([date, daySlots]) => (
          <div key={date} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                    s.is_booked ? "bg-red-50 text-red-400" : "bg-green-50 text-green-600"
                  }`}
                >
                  <span>{s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}</span>
                  {s.is_booked ? (
                    <span className="text-[10px] opacity-60">Booked</span>
                  ) : (
                    <button onClick={() => deleteSlot(s.id)} className="text-red-400 hover:text-red-600 text-[10px]">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
