"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BookingQuestion } from "@/lib/types";

const TYPES = ["checkbox", "text", "select"] as const;
const emptyForm = { label: "", type: "checkbox" as string, options: "", required: false, sort_order: "0" };

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [questions, setQuestions] = useState<BookingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("booking_questions")
      .select("*")
      .order("sort_order")
      .order("created_at");
    setQuestions((data as BookingQuestion[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

  const startEdit = (q: BookingQuestion) => {
    setEditId(q.id);
    setForm({
      label: q.label,
      type: q.type,
      options: q.options?.join(", ") || "",
      required: q.required,
      sort_order: String(q.sort_order),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      label: form.label,
      type: form.type,
      options: form.type === "select" ? form.options.split(",").map((o) => o.trim()).filter(Boolean) : null,
      required: form.required,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (editId) {
      await supabase.from("booking_questions").update(payload).eq("id", editId);
    } else {
      await supabase.from("booking_questions").insert(payload);
    }

    resetForm();
    setSaving(false);
    load();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("booking_questions").update({ active: !active }).eq("id", id);
    load();
  };

  const deleteQuestion = async (id: string) => {
    await supabase.from("booking_questions").delete().eq("id", id);
    load();
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Booking Questions</h2>
      <p className="text-xs text-gray-400 mb-6">
        These questions appear on the booking form for customers to answer.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="card border border-gray-100 space-y-4 h-fit">
          <h3 className="font-semibold text-sm text-gray-700">
            {editId ? "Edit Question" : "Add Question"}
          </h3>

          <input
            required
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Do you have water on facility?"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t === "checkbox" ? "Yes / No" : t === "text" ? "Text" : "Dropdown"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
              />
            </div>
          </div>

          {form.type === "select" && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Options (comma separated)</label>
              <input
                value={form.options}
                onChange={(e) => setForm({ ...form, options: e.target.value })}
                placeholder="Option A, Option B, Option C"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.required}
              onChange={(e) => setForm({ ...form, required: e.target.checked })}
              className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink/40"
            />
            Required
          </label>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary text-xs flex-1 disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="btn-secondary text-xs px-4">Cancel</button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {questions.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No questions yet. Add one to get started.</p>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className={`card border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${!q.active ? "opacity-50 border-gray-200" : "border-gray-100"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-800">{q.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">
                      {q.type === "checkbox" ? "Yes / No" : q.type}
                    </span>
                    {q.required && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-pink-soft text-brand-pink">Required</span>
                    )}
                    <span className="text-[10px] text-gray-400">#{q.sort_order}</span>
                  </div>
                  {q.type === "select" && q.options && (
                    <p className="text-xs text-gray-400">Options: {(q.options as string[]).join(", ")}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(q)} className="text-xs text-brand-blue hover:underline">Edit</button>
                  <button onClick={() => toggleActive(q.id, q.active)} className="text-xs text-gray-500 hover:underline">
                    {q.active ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => deleteQuestion(q.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
