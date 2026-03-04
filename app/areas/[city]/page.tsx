import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DFW_CITIES, type CityData } from "@/lib/cities";
import JsonLd, { buildCityServiceSchema } from "@/components/JsonLd";

interface Props {
  params: { city: string };
}

function getCity(slug: string): CityData | undefined {
  return DFW_CITIES.find((c) => c.slug === slug);
}

export function generateStaticParams() {
  return DFW_CITIES.map((city) => ({ city: city.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCity(params.city);
  if (!city) return {};

  const title = `Foam & Bubble Parties in ${city.name}, TX`;
  const description = `Book a foam party or bubble truck in ${city.name}, Texas. TheBubbleHeros brings foam cannons, bubble machines, and trained operators to your ${city.name} event. Non-toxic, mess-free fun for all ages.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TheBubbleHeros`,
      description,
      url: `https://thebubbleheros.com/areas/${city.slug}`,
    },
    alternates: {
      canonical: `https://thebubbleheros.com/areas/${city.slug}`,
    },
  };
}

export default function CityPage({ params }: Props) {
  const city = getCity(params.city);
  if (!city) notFound();

  const otherCities = DFW_CITIES.filter((c) => c.slug !== city.slug).slice(0, 6);

  return (
    <div className="py-12 px-4">
      <JsonLd data={buildCityServiceSchema(city.name)} />

      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Bubble & Foam Parties in{" "}
            <span className="text-gradient">{city.name}, TX</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            TheBubbleHeros brings professional foam cannons, bubble machines,
            and trained operators to events across {city.name} and{" "}
            {city.county}. Non-toxic, hypoallergenic, and 100% mess-free.
          </p>
        </div>

        {/* Main content */}
        <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4 mb-12">
          <p>{city.description}</p>

          <h2 className="text-2xl font-bold text-gray-800 !mt-8">
            What We Offer in {city.name}
          </h2>
          <ul className="space-y-2">
            <li>
              <strong>Foam Party</strong> — Professional foam cannon with
              non-stop music and a trained operator. Safe, organic,
              biodegradable foam that kids and adults love.
            </li>
            <li>
              <strong>Bubble Bash</strong> — Industrial bubble machines
              filling your venue with thousands of bubbles for an hour or
              more of pure fun.
            </li>
            <li>
              <strong>Glow Foam Party</strong> — UV blacklights and glowing
              neon foam for an unforgettable nighttime party experience.
            </li>
            <li>
              <strong>Birthday Packages</strong> — All-inclusive birthday
              party packages with decorations, bubble-themed favors, and
              multi-hour fun.
            </li>
            <li>
              <strong>Large Events</strong> — Discounted hourly rates for
              school field days, church events, corporate picnics, and
              community festivals.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 !mt-8">
            Why {city.name} Families Choose TheBubbleHeros
          </h2>
          <p>
            Every foam and bubble party includes complete setup, a trained
            operator, kid-friendly music, and teardown. Our foam solution is
            dermatologist-approved — non-toxic, hypoallergenic, odorless,
            and fully biodegradable. It evaporates within 15–30 minutes,
            leaving zero residue on grass, driveways, or clothes. No cleanup
            required from you.
          </p>
          <p>
            We also serve nearby areas including{" "}
            {city.nearbyAreas.join(", ")}. No matter where you are in the
            DFW Metroplex, TheBubbleHeros brings the party to you.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-brand-gradient rounded-3xl p-10 text-white shadow-xl mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready for a Foam Party in {city.name}?
          </h2>
          <p className="mb-6 opacity-90">
            Book your bubble or foam party today and create unforgettable
            memories!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full bg-white text-brand-pink font-semibold px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              View Packages
            </Link>
            <Link
              href="/dashboard/book"
              className="inline-flex items-center justify-center rounded-full bg-white/20 text-white font-semibold px-8 py-3 border border-white/40 hover:bg-white/30 transition-all"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Other cities */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            We Also Serve These DFW Cities
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="text-sm px-3 py-1.5 rounded-full bg-brand-gradient-soft/40 text-gray-700 hover:text-brand-pink transition-colors"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/areas/dallas"
              className="text-sm px-3 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink font-medium hover:bg-brand-pink/20 transition-colors"
            >
              View All Areas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
