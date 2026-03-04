import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TheBubbleHeros | Bubble & Foam Parties in DFW",
    short_name: "TheBubbleHeros",
    description:
      "DFW's top-rated bubble and foam party service. Book foam cannons, bubble machines, and trained operators for your next event.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF6B9D",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
