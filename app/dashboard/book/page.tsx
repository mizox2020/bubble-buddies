"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SlotPicker from "@/components/SlotPicker";
import type { Service, BookingQuestion } from "@/lib/types";

const STEPS = ["Choose Package", "Pick Time", "Event Details", "Confirm"];

const FALLBACK_SERVICES: Service[] = [
  {
    id: "1", name: "Mini Bubble Bash", description: "Perfect for small gatherings!", price: 199,
    duration_minutes: 60, images: [], features: ["Up to 15 kids", "1 bubble machine"], active: true, created_at: "",
  },
  {
    id: "2", name: "Bubble Bonanza", description: "Our most popular package!", price: 349,
    duration_minutes: 120, images: [], features: ["Up to 30 kids", "3 bubble machines", "Foam pit"], active: true, created_at: "",
  },
  {
    id: "3", name: "Foam Frenzy Deluxe", description: "The ultimate experience!", price: 549,
    duration_minutes: 180, images: [], features: ["Up to 50 kids", "5 bubble machines", "LED show"], active: true, created_at: "",
  },
  {
    id: "4", name: "Bubble Birthday Special", description: "All-inclusive birthday!", price: 449,
    duration_minutes: 150, images: [], features: ["Up to 40 kids", "4 bubble machines", "Decorations"], active: true, created_at: "",
  },
];

export default function BookPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState<BookingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("price")
      .then(({ data }) => {
        if (data && data.length > 0) setServices(data as Service[]);
      });
    supabase
      .from("booking_questions")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setQuestions(data as BookingQuestion[]);
      });
  }, [supabase]);

  const selectedServiceObj = services.find((s) => s.id === selectedService);

  const canProceed = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedSlot;
    if (step === 2) return address.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase.from("bookings").insert({
        user_id: user.id,
        service_id: selectedService!,
        slot_id: selectedSlot!,
        event_address: address,
        guest_count: parseInt(guestCount) || 0,
        notes: notes || null,
        answers,
      });

      if (insertError) throw insertError;
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold mb-2">
          Book an <span className="text-gradient">Event</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Follow the steps below to schedule your bubble party.
        </p>
      </motion.div>

      {/* Stepper */}
      <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === step
                  ? "bg-brand-pink text-white"
                  : i < step
                  ? "bg-brand-pink/10 text-brand-pink"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline whitespace-nowrap">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 h-0.5 ${
                  i < step ? "bg-brand-pink/30" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-[300px]"
        >
          {/* Step 0: Choose package */}
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <motion.button
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedService(service.id)}
                  className={`card text-left border-2 transition-all ${
                    selectedService === service.id
                      ? "border-brand-pink shadow-lg ring-2 ring-brand-pink/20"
                      : "border-gray-100 hover:border-brand-pink/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{service.name}</h3>
                    <span className="text-lg font-bold text-gradient">
                      ${service.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {service.description}
                  </p>
                  <span className="text-xs text-brand-blue">
                    {service.duration_minutes} min
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Step 1: Pick time */}
          {step === 1 && (
            <SlotPicker selected={selectedSlot} onSelect={setSelectedSlot} />
          )}

          {/* Step 2: Event details */}
          {step === 2 && (
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink"
                  placeholder="123 Party Street, City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Guests
                </label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink"
                  placeholder="20"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink resize-none"
                  placeholder="Any special requests or details..."
                />
              </div>

              {/* Dynamic booking questions */}
              {questions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium text-gray-700">Facility Details</p>
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
                            {q.label}
                            {q.required && <span className="text-brand-pink ml-1">*</span>}
                          </label>
                          <input
                            type="text"
                            required={q.required}
                            value={(answers[q.id] as string) || ""}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/40"
                          />
                        </div>
                      )}
                      {q.type === "select" && q.options && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            {q.label}
                            {q.required && <span className="text-brand-pink ml-1">*</span>}
                          </label>
                          <select
                            required={q.required}
                            value={(answers[q.id] as string) || ""}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/40"
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
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && selectedServiceObj && (
            <div className="card border border-brand-pink-soft/30 max-w-md">
              <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Package</span>
                  <span className="font-medium">{selectedServiceObj.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-bold text-gradient">
                    ${selectedServiceObj.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-right max-w-[200px]">
                    {address}
                  </span>
                </div>
                {guestCount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span className="font-medium">{guestCount}</span>
                  </div>
                )}
                {notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Notes</span>
                    <span className="font-medium text-right max-w-[200px]">
                      {notes}
                    </span>
                  </div>
                )}
                {questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "" && answers[q.id] !== false).length > 0 && (
                  <div className="pt-2 border-t border-gray-50 space-y-2">
                    {questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "" && answers[q.id] !== false).map((q) => (
                      <div key={q.id} className="flex justify-between">
                        <span className="text-gray-500">{q.label}</span>
                        <span className="font-medium text-right">
                          {q.type === "checkbox" ? (answers[q.id] ? "Yes" : "No") : String(answers[q.id])}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">
                  Payment will be collected later. You&apos;ll receive a confirmation email.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-3">
                  {error}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &larr; Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue &rarr;
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        )}
      </div>
    </>
  );
}
