import { getIndexableUrlRecords } from "@/lib/organicUrls";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";

  return getIndexableUrlRecords(base).map(({ url, lastModified }) => ({
    url,
    ...(lastModified ? { lastModified } : {})
  }));
}
