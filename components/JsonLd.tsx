interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "TheBubbleHeros",
  description:
    "DFW's top-rated bubble and foam party service. We bring bubble machines, foam cannons, and the fun to your event.",
  url: "https://thebubbleheros.com",
  telephone: "+1-469-555-0199",
  email: "Booking@thebubbleheros.com",
  areaServed: {
    "@type": "Place",
    name: "Dallas-Fort Worth Metroplex",
  },
  serviceType: [
    "Foam Party",
    "Bubble Party",
    "Bubble Truck Rental",
    "Glow Foam Party",
    "Foam Cannon Rental",
  ],
  priceRange: "$$",
  image: "https://thebubbleheros.com/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dallas",
    addressRegion: "TX",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 32.7767,
    longitude: -96.797,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "08:00",
    closes: "22:00",
  },
};

export function buildFaqSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildCityServiceSchema(cityName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Foam & Bubble Party",
    provider: {
      "@type": "LocalBusiness",
      name: "TheBubbleHeros",
      url: "https://thebubbleheros.com",
    },
    areaServed: {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "Place",
        name: "Dallas-Fort Worth Metroplex, TX",
      },
    },
    description: `Professional foam and bubble party services in ${cityName}, TX. Non-toxic, hypoallergenic foam for birthdays, schools, churches, and corporate events.`,
  };
}
