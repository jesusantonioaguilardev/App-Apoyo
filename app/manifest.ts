import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AppApoyo",
    short_name: "AppApoyo",
    description: "Acompañamiento emocional con IA",
    start_url: "/inicio",
    display: "standalone",
    background_color: "#f7f5f0",
    theme_color: "#2f7a6d",
    lang: "es-MX",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
