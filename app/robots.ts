import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth", "/dashboard", "/login", "/welcome"],
    },
    host: "https://thebubbleheros.com",
    sitemap: "https://thebubbleheros.com/sitemap.xml",
  };
}
