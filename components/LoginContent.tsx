"use client";

import { motion } from "framer-motion";
import AuthForm from "@/components/AuthForm";

export default function LoginContent() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🫧</span>
          <h1 className="text-3xl font-extrabold">
            Welcome to <span className="text-gradient">TheBubbleHeros</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to book your next bubble party!
          </p>
        </div>

        <div className="card border border-brand-pink-soft/30 p-8">
          <AuthForm />
        </div>
      </motion.div>
    </div>
  );
}
