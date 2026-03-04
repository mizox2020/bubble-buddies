"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/types";

const emptyService = { name: "", description: "", price: "", duration_minutes: "60", features: "" };

function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") try { const p = JSON.parse(raw); if (Array.isArray(p)) return p; } catch {}
  return [];
}

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") try { const p = JSON.parse(raw); if (Array.isArray(p)) return p; } catch {}
  return [];
}

export default function AdminServicesPage() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyService);
  const [editId, setEditId] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("services").select("*").order("price");
    setServices((data as Service[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm(emptyService); setEditId(null); setEditImages([]); };

  const startEdit = (s: Service) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      description: s.description || "",
      price: String(s.price),
      duration_minutes: String(s.duration_minutes),
      features: parseFeatures(s.features).join("\n"),
    });
    setEditImages(parseImages(s.images));
  };

  const uploadImages = async (files: FileList, serviceId: string) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${serviceId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("service-images").upload(path, file, { upsert: false });
      if (!error) {
        const { data } = supabase.storage.from("service-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setUploading(false);
    return urls;
  };

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (editId) {
      const newUrls = await uploadImages(files, editId);
      const updated = [...editImages, ...newUrls];
      setEditImages(updated);
      await supabase.from("services").update({ images: updated }).eq("id", editId);
      load();
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = async (url: string) => {
    const updated = editImages.filter((u) => u !== url);
    setEditImages(updated);
    if (editId) {
      await supabase.from("services").update({ images: updated }).eq("id", editId);

      const pathMatch = url.match(/service-images\/(.+)$/);
      if (pathMatch) {
        await supabase.storage.from("service-images").remove([pathMatch[1]]);
      }
      load();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      duration_minutes: parseInt(form.duration_minutes),
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    if (editId) {
      await supabase.from("services").update(payload).eq("id", editId);
    } else {
      const { data } = await supabase.from("services").insert(payload).select("id").single();
      if (data && fileRef.current?.files?.length) {
        const urls = await uploadImages(fileRef.current.files, data.id);
        await supabase.from("services").update({ images: urls }).eq("id", data.id);
      }
    }
    resetForm();
    setSaving(false);
    load();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("services").update({ active: !active }).eq("id", id);
    load();
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="card border border-gray-100 space-y-4 lg:col-span-1 h-fit">
        <h2 className="font-semibold text-gray-800">{editId ? "Edit Service" : "Add Service"}</h2>
        <input
          required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Service name" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
        />
        <textarea
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description" rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40 resize-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
          />
          <input
            required type="number" min="15" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
            placeholder="Minutes" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40"
          />
        </div>
        <textarea
          value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
          placeholder={"Features (one per line)\ne.g. Up to 15 kids\n1 bubble machine"} rows={4}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink/40 resize-none"
        />

        {/* Image upload */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">
            Images {editId ? "" : "(save first, then add images)"}
          </label>
          {editId && editImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
              {editImages.map((url) => (
                <div key={url} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden group/img border border-gray-200">
                  <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            disabled={!editId || uploading}
            onChange={handleFilePick}
            className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20 disabled:opacity-40"
          />
          {uploading && <p className="text-xs text-brand-blue mt-1">Uploading...</p>}
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary text-xs flex-1 disabled:opacity-50">
            {saving ? "Saving..." : editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="btn-secondary text-xs px-4">Cancel</button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="lg:col-span-2 space-y-3">
        {services.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No services yet.</p>
        ) : (
          services.map((s) => {
            const imgs = parseImages(s.images);
            return (
              <div key={s.id} className={`card border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${!s.active ? "opacity-50" : "border-gray-100"}`}>
                {imgs.length > 0 && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image src={imgs[0]} alt={s.name} fill className="object-cover" sizes="64px" />
                    {imgs.length > 1 && (
                      <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[9px] px-1 rounded">
                        +{imgs.length - 1}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-sm font-bold text-gradient">${s.price}</span>
                    <span className="text-xs text-gray-400">{s.duration_minutes}min</span>
                    {!s.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{s.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(s)} className="text-xs text-brand-blue hover:underline">Edit</button>
                  <button onClick={() => toggleActive(s.id, s.active)} className="text-xs text-gray-500 hover:underline">
                    {s.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
