"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Bookings" },
  { href: "/dashboard/calendar", label: "Calendar" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/slots", label: "Time Slots" },
  { href: "/admin/bookings/new", label: "New Booking" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🛠</span>
        <h1 className="text-2xl font-extrabold text-gradient">Admin Panel</h1>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              pathname === l.href
                ? "bg-brand-pink text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
