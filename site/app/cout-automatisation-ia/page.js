import BuildGuide from "@/components/BuildGuide";
import { buildGuides } from "@/content/buildGuides";

const slug = "cout-automatisation-ia";
const data = buildGuides[slug];

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: "/" + slug },
  openGraph: { title: data.metaTitle, description: data.metaDescription, url: "/" + slug, type: "article" }
};

export default function Page() { return <BuildGuide slug={slug} />; }
