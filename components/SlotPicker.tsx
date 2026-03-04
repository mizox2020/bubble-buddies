"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import type { AvailableSlot } from "@/lib/types";

type PickerMode = "quick" | "calendar";

export default function SlotPicker({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (slotId: string) => void;
}) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [mode, setMode] = useState<PickerMode>("quick");
  const [calMonth, setCalMonth] = useState(new Date());

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("available_slots")
      .select("*")
      .eq("is_booked", false)
      .gte("slot_date", new Date().toISOString().split("T")[0])
      .order("slot_date")
      .order("start_time")
      .then(({ data }) => {
        setSlots((data as AvailableSlot[]) || []);
        setLoading(false);
      });
  }, []);

  const dates = useMemo(
    () => Array.from(new Set(slots.map((s) => s.slot_date))),
    [slots]
  );

  const dateSet = useMemo(() => new Set(dates), [dates]);

  const slotsForDate = useMemo(
    () => slots.filter((s) => s.slot_date === selectedDate),
    [slots, selectedDate]
  );

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) setSelectedDate(dates[0]);
  }, [dates, selectedDate]);

  const handleDateSelect = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
  }, []);

  // Calendar grid days
  const calDays = useMemo(() => {
    const monthStart = startOfMonth(calMonth);
    const monthEnd = endOfMonth(calMonth);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [calMonth]);

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading available times...</div>;
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No available slots at the moment.</p>
        <p className="text-sm text-gray-400 mt-1">Please check back later or contact us directly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Select a Date</p>
        <button
          type="button"
          onClick={() => setMode(mode === "quick" ? "calendar" : "quick")}
          className="flex items-center gap-1.5 text-xs text-brand-blue hover:text-brand-pink transition-colors"
        >
          {mode === "quick" ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar view
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Quick pick
            </>
          )}
        </button>
      </div>

      {/* Quick date cards */}
      {mode === "quick" && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => {
            const d = new Date(date + "T00:00:00");
            const isSelected = date === selectedDate;
            return (
              <button
                type="button"
                key={date}
                onClick={() => handleDateSelect(date)}
                className={`flex flex-col items-center min-w-[70px] py-2 px-3 rounded-xl border-2 transition-all text-sm ${
                  isSelected
                    ? "border-brand-pink bg-brand-pink/5 text-brand-pink"
                    : "border-gray-200 hover:border-brand-pink/40 text-gray-600"
                }`}
              >
                <span className="text-xs font-medium uppercase">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-lg font-bold">{d.getDate()}</span>
                <span className="text-xs">
                  {d.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Calendar grid */}
      {mode === "calendar" && (
        <div className="border border-gray-200 rounded-xl p-3">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCalMonth(subMonths(calMonth, 1))}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {format(calMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => setCalMonth(addMonths(calMonth, 1))}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {calDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const hasSlots = dateSet.has(dateStr);
              const isCurrentMonth = isSameMonth(day, calMonth);
              const isSelected = selectedDate === dateStr;
              const today = isToday(day);

              return (
                <button
                  type="button"
                  key={dateStr}
                  disabled={!hasSlots}
                  onClick={() => hasSlots && handleDateSelect(dateStr)}
                  className={`relative aspect-square flex items-center justify-center rounded-lg text-xs transition-all ${
                    isSelected
                      ? "bg-brand-pink text-white font-bold shadow-sm"
                      : hasSlots
                      ? "text-gray-700 hover:bg-brand-pink/10 font-medium cursor-pointer"
                      : isCurrentMonth
                      ? "text-gray-300"
                      : "text-gray-200"
                  } ${today && !isSelected ? "ring-1 ring-brand-blue/40" : ""}`}
                >
                  {day.getDate()}
                  {hasSlots && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-pink" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Time slots */}
      {selectedDate && slotsForDate.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Available Times —{" "}
            <span className="text-brand-pink">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {slotsForDate.map((slot) => {
              const isSlotSelected = slot.id === selected;
              return (
                <motion.button
                  type="button"
                  key={slot.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(slot.id)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    isSlotSelected
                      ? "border-brand-pink bg-brand-pink text-white shadow-md"
                      : "border-gray-200 hover:border-brand-pink/40 text-gray-600"
                  }`}
                >
                  {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate && slotsForDate.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No available times on this date.</p>
      )}
    </div>
  );
}
