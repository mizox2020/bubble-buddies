"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FoamCannons from "@/components/FoamCannons";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const steps = [
  {
    icon: "🎯",
    title: "Choose Your Package",
    description: "Browse our fun-filled bubble and foam party packages for any occasion.",
  },
  {
    icon: "📅",
    title: "Pick a Date",
    description: "Select from our available time slots that work best for your event.",
  },
  {
    icon: "🎉",
    title: "Party Time!",
    description: "We show up with all the gear and make your event unforgettable!",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    text: "The kids absolutely LOVED it! The bubble machines were incredible and the foam pit was a huge hit. Best party ever!",
    rating: 5,
  },
  {
    name: "James R.",
    text: "TheBubbleHeros made our daughter's 7th birthday magical. Professional, fun, and so easy to book. Highly recommend!",
    rating: 5,
  },
  {
    name: "Lisa K.",
    text: "We hired them for our community event and they exceeded every expectation. Kids AND adults had a blast!",
    rating: 5,
  },
];

export default function HomeHero() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" data-foam-section>
        <div className="absolute inset-0 bg-brand-gradient-soft opacity-40" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            data-foam-ledge
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Dallas Fort Worth&apos;s Best{" "}
            <span className="text-gradient">Bubble</span> &{" "}
            <span className="text-gradient">Foam Parties</span>
          </motion.h1>
          <motion.p
            data-foam-ledge
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto"
          >
            We bring bubble machines, foam cannons, and trained operators to your
            backyard, school, or event anywhere in the DFW Metroplex.
          </motion.p>
          <motion.div
            data-foam-ledge
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center relative z-20"
          >
            <Link href="/services" className="btn-primary text-base px-8 py-4">
              View Packages
            </Link>
            <Link href="/dashboard/book" className="btn-secondary text-base px-8 py-4">
              Book Now
            </Link>
          </motion.div>
        </div>
        <FoamCannons />
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center mb-14"
          >
            How It <span className="text-gradient">Works</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="card text-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-brand-gradient-soft/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center mb-14"
          >
            What DFW Parents <span className="text-gradient">Say</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="card"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold text-brand-pink">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-3xl mx-auto text-center bg-brand-gradient rounded-3xl p-10 text-white shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Foam Party in DFW?</h2>
          <p className="mb-6 opacity-90">
            Book your bubble or foam party today and create memories that last a lifetime!
          </p>
          <Link
            href="/dashboard/book"
            className="inline-flex items-center justify-center rounded-full bg-white text-brand-pink font-semibold px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </>
  );
}
