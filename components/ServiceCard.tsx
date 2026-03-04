"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImageCarousel from "@/components/ImageCarousel";
import type { Service } from "@/lib/types";

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

export default function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const features = parseFeatures(service.features);
  const images = parseImages(service.images);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="card flex flex-col border border-brand-pink-soft/30 overflow-hidden"
    >
      {/* Image Carousel */}
      <div className="mb-4 -mx-6 -mt-6">
        <ImageCarousel images={images} alt={service.name} />
      </div>

      {/* Price Badge */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
        <span className="text-2xl font-extrabold text-gradient whitespace-nowrap ml-3">
          ${service.price}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4 flex-1">{service.description}</p>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-xs text-brand-blue font-medium mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {service.duration_minutes} minutes
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-brand-pink text-xs">●</span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard/book"
        className="btn-primary mt-auto text-center"
      >
        Book This Package
      </Link>
    </motion.div>
  );
}
