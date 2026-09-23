import { notFound } from "next/navigation";
import ObservatoryLanding from "@/components/ObservatoryLanding";
import { getObservatoryParams, getObservatoryTopic } from "@/content/observatory-solutions";

export function generateStaticParams() {
  return getObservatoryParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const topic = getObservatoryTopic(slug);
  if (!topic) return {};

  return {
    title: topic.title + " — Cas d’usage et automatisations IA | Autonomia",
    description: topic.short + " Découvrez 6 transformations concrètes, un avant/après et un formulaire de diagnostic.",
    alternates: { canonical: "/observatoire-ia/" + topic.slug }
  };
}

export default async function ObservatoryTopicPage({ params }) {
  const { slug } = await params;
  const topic = getObservatoryTopic(slug);
  if (!topic) notFound();

  return <ObservatoryLanding topic={topic} />;
}
