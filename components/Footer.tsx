import Link from "next/link";
import Image from "next/image";
import { DFW_CITIES } from "@/lib/cities";

const topCities = DFW_CITIES.slice(0, 6);

export default function Footer() {
  return (
    <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t border-brand-pink-soft/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="TheBubbleHeros" width={150} height={70} className="flex-shrink-0 object-contain h-25" />
            </div>
            <p className="text-sm text-gray-500">
              DFW&apos;s favorite bubble and foam party service. Bringing joy,
              bubbles, and foam to your celebrations since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-gray-500 hover:text-brand-pink transition-colors">Home</Link>
              <Link href="/services" className="text-sm text-gray-500 hover:text-brand-pink transition-colors">Services & Pricing</Link>
              <Link href="/login" className="text-sm text-gray-500 hover:text-brand-pink transition-colors">Book Now</Link>
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Service Areas</h4>
            <div className="flex flex-col gap-2">
              {topCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/areas/${city.slug}`}
                  className="text-sm text-gray-500 hover:text-brand-pink transition-colors"
                >
                  {city.name}, TX
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <a href="mailto:Booking@thebubbleheros.com" className="hover:text-brand-pink transition-colors">
                Booking@thebubbleheros.com
              </a>
              <span>DFW Metroplex, TX</span>
              <span>Available 7 days a week</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} TheBubbleHeros. All rights reserved.
          Bubble &amp; foam party services across Dallas-Fort Worth.
        </div>
      </div>
    </footer>
  );
}
