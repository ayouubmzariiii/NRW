import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NRW-Haushaltsauflösung",
    short_name: "NRW-Haushalt",
    description: "Entrümpelung, Haushaltsauflösung & Wohnungsauflösung in NRW zum Festpreis.",
    start_url: "/",
    display: "browser",
    background_color: "#f8f6f1",
    theme_color: "#0c1a12",
    icons: [
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
