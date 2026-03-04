"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@/lib/types";

export default function ServicesContent({ services }: { services: Service[] }) {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Bubble & Foam Party <span className="text-gradient">Packages</span> in DFW
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          From intimate birthday gatherings to epic school and corporate
          celebrations — we have the perfect bubble experience for every
          occasion across Dallas-Fort Worth.
        </p>
      </motion.div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </div>

      {/* Custom Event CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center card bg-brand-gradient-soft/40 border border-brand-blue-soft"
      >
        <h3 className="text-xl font-bold mb-2">Need Something Custom?</h3>
        <p className="text-sm text-gray-500 mb-4">
          We can create a tailored bubble experience for any event size or
          theme. Contact us for a custom quote!
        </p>
        <Link href="mailto:Booking@thebubbleheros.com" className="btn-primary">
          Contact Us
        </Link>
      </motion.div>
    </>
  );
}
