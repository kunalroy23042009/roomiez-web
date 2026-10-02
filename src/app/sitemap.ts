import type { MetadataRoute } from "next";

const SITE = "https://roomiez-web.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/app", "/app/map", "/login", "/privacy", "/support"];
  return pages.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "weekly" : "daily",
    priority: p === "" ? 1 : 0.7,
  }));
}
