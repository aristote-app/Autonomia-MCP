import { getAllPages } from "@/lib/pages";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const staticPages = [
    { url: base, priority: 1, changeFrequency: "weekly" }
  ];

  const pages = getAllPages()
    .filter((page) => page.mode !== "diagnostic")
    .map((page) => ({
      url: `${base}/${page.slug}`,
      priority: page.slug === "experts" || page.slug === "academy" ? 0.9 : 0.8,
      changeFrequency: "monthly"
    }));

  return [...staticPages, ...pages];
}
