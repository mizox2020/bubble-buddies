import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ServicesContent from "@/components/ServicesContent";
import JsonLd from "@/components/JsonLd";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bubble & Foam Party Packages in Dallas Fort Worth",
  description:
    "View our foam party, bubble bash, glow foam, and birthday party packages. Prices start at $199. Serving Dallas, Fort Worth, Frisco, Plano, and all of DFW.",
  openGraph: {
    title: "Bubble & Foam Party Packages | TheBubbleHeros DFW",
    description:
      "Foam cannons, bubble machines, and trained operators for birthdays, schools, and events across Dallas-Fort Worth.",
    url: "https://thebubbleheros.com/services",
  },
};

const FALLBACK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Mini Bubble Bash",
    description:
      "Perfect for small gatherings! A fun-filled hour of bubbles and laughter for up to 15 kids.",
    price: 199,
    duration_minutes: 60,
    images: [],
    features: ["Up to 15 kids", "1 bubble machine", "Bubble wands for all", "1 hour of fun"],
    active: true,
    created_at: "",
  },
  {
    id: "2",
    name: "Bubble Bonanza",
    description:
      "Our most popular package! Two hours of non-stop bubble magic with foam pit action.",
    price: 349,
    duration_minutes: 120,
    images: [],
    features: [
      "Up to 30 kids",
      "3 bubble machines",
      "Foam pit included",
      "Bubble wands & swords",
      "2 hours of fun",
    ],
    active: true,
    created_at: "",
  },
  {
    id: "3",
    name: "Foam Frenzy Deluxe",
    description:
      "The ultimate bubble and foam experience! Perfect for large events and celebrations.",
    price: 549,
    duration_minutes: 180,
    images: [],
    features: [
      "Up to 50 kids",
      "5 bubble machines",
      "Giant foam pit",
      "LED bubble show",
      "Bubble wands & swords",
      "3 hours of fun",
      "Event coordinator",
    ],
    active: true,
    created_at: "",
  },
  {
    id: "4",
    name: "Bubble Birthday Special",
    description:
      "Make their birthday unforgettable with our all-inclusive bubble birthday package!",
    price: 449,
    duration_minutes: 150,
    images: [],
    features: [
      "Up to 40 kids",
      "4 bubble machines",
      "Foam pit",
      "Birthday decorations",
      "Bubble-themed party favors",
      "2.5 hours of fun",
    ],
    active: true,
    created_at: "",
  },
];

async function getServices(): Promise<Service[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("price");
    if (data && data.length > 0) return data as Service[];
  } catch {
    // Supabase may not be configured — use fallback
  }
  return FALLBACK_SERVICES;
}

function buildServicesSchema(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bubble & Foam Party Packages",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        offers: {
          "@type": "Offer",
          price: s.price,
          priceCurrency: "USD",
        },
        provider: {
          "@type": "LocalBusiness",
          name: "TheBubbleHeros",
        },
      },
    })),
  };
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <JsonLd data={buildServicesSchema(services)} />
        <ServicesContent services={services} />

        {/* SEO content block */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Foam Party & Bubble Truck Rentals in Dallas-Fort Worth
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            All TheBubbleHeros packages include a trained foam cannon or bubble
            machine operator, kid-friendly music, and complete setup and
            teardown. Our non-toxic, hypoallergenic, biodegradable foam is safe
            for all ages and leaves no mess. We serve birthday parties, school
            events, church gatherings, corporate picnics, and community
            festivals across Dallas, Fort Worth, Frisco, Plano, McKinney,
            Allen, Arlington, and the entire DFW Metroplex.
          </p>
        </div>
      </div>
    </div>
  );
}
