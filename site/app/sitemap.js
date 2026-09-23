import { getIndexableUrlRecords } from "@/lib/organicUrls";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";

  return getIndexableUrlRecords(base).map(({
    url,
    lastModified,
    changeFrequency,
    priority
  }) => ({
    url,
    ...(lastModified ? { lastModified } : {}),
    ...(changeFrequency ? { changeFrequency } : {}),
    ...(typeof priority === "number" ? { priority } : {})
  }));
}
