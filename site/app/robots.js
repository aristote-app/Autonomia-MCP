export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";

  if (isPreview) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/"]
      },
      {
        userAgent: "OAI-AdsBot",
        allow: "/",
        disallow: ["/api/"]
      }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
