"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const STEPS = [
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

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Hero");
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const handleGetStarted = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ welcome_seen_at: new Date().toISOString() }).eq("id", user.id);
    }
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-blue-50 to-pink-50">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/bubble-heroes-logo.png"
            alt="The Bubble Heroes"
            width={200}
            height={80}
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-sky-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-brand-pink px-6 py-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Welcome, <span className="text-yellow-200">{userName}</span>!
            </h1>
            <p className="text-white/90 text-sm mt-1">
              You&apos;re officially a Bubble Hero. Here&apos;s how we make the magic happen.
            </p>
          </div>

          {/* What we do */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              TheBubbleHeros is a mobile foam and bubble party service serving the entire DFW Metroplex. 
              We bring professional foam cannons, bubble machines, and trained operators to your backyard, 
              school, or event. Our foam is 100% organic, non-toxic, and mess-free — it evaporates within 
              15–30 minutes. No cleanup required!
            </p>

            <h2 className="text-lg font-semibold text-gray-800 pt-2">How It Works</h2>
            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 p-3 rounded-xl bg-sky-50/50 border border-sky-100"
                >
                  <span className="text-2xl shrink-0">{step.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{step.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={handleGetStarted}
              className="w-full mt-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </button>
          </div>
        </motion.div>

        <p className="text-center text-gray-500 text-xs mt-6">
          The Bubble Heroes · Bubble parties that make memories
        </p>
      </div>
    </div>
  );
}
