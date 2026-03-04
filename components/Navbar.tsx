"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole(data?.role ?? "user");
      }
    }
    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) setRole(null);
      else {
        supabase.from("profiles").select("role").eq("id", u.id).single()
          .then(({ data }) => setRole(data?.role ?? "user"));
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    window.location.href = "/";
  };

  const isAdmin = role === "admin";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-pink-soft/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="TheBubbleHeros" width={160} height={40} className="flex-shrink-0 object-contain h-14" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-brand-pink transition-colors">
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-brand-pink transition-colors">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-brand-blue hover:text-brand-pink transition-colors">
              Admin
            </Link>
          )}
          {user ? (
            <button onClick={handleSignOut} className="btn-secondary text-xs py-2 px-4">Sign Out</button>
          ) : (
            <Link href="/login" className="btn-primary text-xs py-2 px-4">Log In</Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600" aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-brand-pink-soft/50 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-brand-pink">
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-brand-pink">Dashboard</Link>
                  <Link href="/dashboard/calendar" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-brand-pink">My Calendar</Link>
                </>
              )}
              {isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-brand-blue hover:text-brand-pink">Admin</Link>
              )}
              {user ? (
                <button onClick={handleSignOut} className="btn-secondary text-xs py-2 px-4 w-fit">Sign Out</button>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-xs py-2 px-4 w-fit">Log In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
