import type { MetadataRoute } from "next";
import { DFW_CITIES } from "@/lib/cities";

const BASE = "https://thebubbleheros.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityPages = DFW_CITIES.map((city) => ({
    url: `${BASE}/areas/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...cityPages,
  ];
}
