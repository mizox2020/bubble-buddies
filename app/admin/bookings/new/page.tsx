"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SlotPicker from "@/components/SlotPicker";
import type { BookingQuestion } from "@/lib/types";

interface ServiceOption { id: string; name: string; price: number; }
interface UserOption { id: string; full_name: string | null; }

export default function AdminNewBookingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [questions, setQuestions] = useState<BookingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    user_id: "",
    service_id: "",
    slot_id: "",
    assigned_user_id: "",
    event_address: "",
    guest_count: "20",
    notes: "",
  });

  const load = useCallback(async () => {
    const [svcRes, userRes, qRes] = await Promise.all([
      supabase.from("services").select("id, name, price").eq("active", true).order("price"),
      supabase.from("profiles").select("id, full_name"),
      supabase.from("booking_questions").select("*").eq("active", true).order("sort_order"),
    ]);
    setServices((svcRes.data as ServiceOption[]) || []);
    setUsers((userRes.data as UserOption[]) || []);
    setQuestions((qRes.data as BookingQuestion[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error: err } = await supabase.from("bookings").insert({
      user_id: form.user_id,
      service_id: form.service_id,
      slot_id: form.slot_id,
      assigned_user_id: form.assigned_user_id || null,
      event_address: form.event_address || null,
      guest_count: parseInt(form.guest_count) || 0,
      notes: form.notes || null,
      answers,
      status: "confirmed",
    });

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    router.push("/admin");
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto card border border-gray-100 space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Create Booking</h2>

      {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div>
        <label className="block text-xs text-gray-500 mb-1">Customer</label>
        <select
          required value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
        >
          <option value="">Select customer...</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.full_name || u.id.slice(0, 8)}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Service</label>
        <select
          required value={form.service_id} onChange={(e) => setForm({ ...form, service_id: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
        >
          <option value="">Select service...</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name} — ${s.price}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-2">Time Slot</label>
        <SlotPicker selected={form.slot_id || null} onSelect={(id) => setForm({ ...form, slot_id: id })} />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Assign Staff (optional)</label>
        <select
          value={form.assigned_user_id} onChange={(e) => setForm({ ...form, assigned_user_id: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
        >
          <option value="">Unassigned</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.full_name || u.id.slice(0, 8)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Event Address</label>
          <input
            value={form.event_address} onChange={(e) => setForm({ ...form, event_address: e.target.value })}
            placeholder="123 Party St" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Guest Count</label>
          <input
            type="number" min="0" value={form.guest_count} onChange={(e) => setForm({ ...form, guest_count: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Notes</label>
        <textarea
          value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2} placeholder="Special requests..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40 resize-none"
        />
      </div>

      {/* Dynamic booking questions */}
      {questions.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Facility Details</p>
          {questions.map((q) => (
            <div key={q.id}>
              {q.type === "checkbox" && (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!!answers[q.id]}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink/40"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800">
                    {q.label}
                    {q.required && <span className="text-brand-pink ml-1">*</span>}
                  </span>
                </label>
              )}
              {q.type === "text" && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {q.label}{q.required && <span className="text-brand-pink ml-1">*</span>}
                  </label>
                  <input
                    type="text" required={q.required}
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
                  />
                </div>
              )}
              {q.type === "select" && q.options && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {q.label}{q.required && <span className="text-brand-pink ml-1">*</span>}
                  </label>
                  <select
                    required={q.required}
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
                  >
                    <option value="">Select...</option>
                    {(q.options as string[]).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
        {saving ? "Creating..." : "Create Booking"}
      </button>
    </form>
  );
}
