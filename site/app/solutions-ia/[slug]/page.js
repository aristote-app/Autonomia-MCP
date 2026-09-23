import { notFound } from "next/navigation";
import ProblemLanding from "@/components/ProblemLanding";
import { getProblemFaq, getProblemParams, getProblemSolution } from "@/content/problem-solutions";

export function generateStaticParams() {
  return getProblemParams();
}

export async function generateMetadata({ params }) {
  const { slug }=await params;
  const problem=getProblemSolution(slug);
  if (!problem) return {};
  return {
    title: problem.title + " | Autonomia",
    description: problem.intro,
    alternates: { canonical: "/solutions-ia/" + problem.slug },
    openGraph: { title: problem.title + " | Autonomia", description: problem.intro, type: "website" }
  };
}

export default async function ProblemPage({ params }) {
  const { slug }=await params;
  const problem=getProblemSolution(slug);
  if (!problem) notFound();
  const base=process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const url=base + "/solutions-ia/" + problem.slug;
  const faq=getProblemFaq(problem);
  const schema={
    "@context":"https://schema.org",
    "@graph":[
      {"@type":"Service","@id":url+"#service",name:problem.title,description:problem.intro,url,provider:{"@id":base+"#organization"},areaServed:{"@type":"Country",name:"France"}},
      {"@type":"FAQPage","@id":url+"#faq",mainEntity:faq.map((item)=>({"@type":"Question",name:item.question,acceptedAnswer:{"@type":"Answer",text:item.answer}}))},
      {"@type":"BreadcrumbList","@id":url+"#breadcrumb",itemListElement:[
        {"@type":"ListItem",position:1,name:"Autonomia",item:base},
        {"@type":"ListItem",position:2,name:"Solutions IA",item:base+"/solutions-ia"},
        {"@type":"ListItem",position:3,name:problem.title,item:url}
      ]}
    ]
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><ProblemLanding problem={problem}/></>;
}
