import type { Metadata } from "next";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import FAQ from "@/components/FAQ";
import { faqs } from "@/lib/faq-data";
import JsonLd, { LOCAL_BUSINESS_SCHEMA, buildFaqSchema } from "@/components/JsonLd";
import { DFW_CITIES } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Bubble & Foam Parties in Dallas Fort Worth | TheBubbleHeros",
  description:
    "DFW's favorite bubble and foam party service. We bring foam cannons, bubble machines, and trained operators to your backyard, school, or event. Serving Dallas, Fort Worth, Frisco, Plano, and 20+ cities.",
  openGraph: {
    title: "Bubble & Foam Parties in Dallas Fort Worth | TheBubbleHeros",
    description:
      "Book the ultimate foam party experience in DFW. Non-toxic, mess-free, and fun for all ages!",
    url: "https://thebubbleheros.com",
  },
};

const topCities = DFW_CITIES.slice(0, 8);

export default function Home() {
  return (
    <>
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
      <JsonLd data={buildFaqSchema(faqs)} />

      <HomeHero />

      {/* About Our Bubble Parties — keyword-rich content for crawlers */}
      <section className="py-20 px-4 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Foam Party & Bubble Truck Rentals Across{" "}
            <span className="text-gradient">Dallas-Fort Worth</span>
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
            <p>
              TheBubbleHeros is a mobile foam and bubble party service proudly
              serving the entire DFW Metroplex. We bring professional-grade foam
              cannons, industrial bubble machines, high-energy music, and trained
              operators directly to your location — whether that is your backyard
              in Frisco, a school playground in Plano, a church parking lot in
              Fort Worth, or a corporate venue in Dallas.
            </p>
            <p>
              Our foam solution is 100% organic, non-toxic, hypoallergenic, and
              biodegradable. It is safe for kids of all ages, gentle on sensitive
              skin, and leaves absolutely no mess behind — the foam evaporates
              within 15 to 30 minutes after the party. No cleanup required.
            </p>
            <p>
              Whether you are planning a kids birthday party, a summer block
              party, a school field day, a VBS event, a graduation celebration,
              or a corporate team-building outing, our bubble and foam party
              packages are designed to deliver an unforgettable experience. We
              handle all setup, operation, and teardown so you can focus on
              making memories.
            </p>
          </div>

          {/* Service area links */}
          <div className="mt-10 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Serving Cities Across the DFW Metroplex
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {topCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/areas/${city.slug}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-brand-gradient-soft/40 text-gray-700 hover:text-brand-pink transition-colors"
                >
                  {city.name}
                </Link>
              ))}
              <Link
                href="/areas/dallas"
                className="text-sm px-3 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink font-medium hover:bg-brand-pink/20 transition-colors"
              >
                + {DFW_CITIES.length - topCities.length} more cities
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}
