"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/clientTracking";

export default function ProblemLink({
  href,
  problemSlug = null,
  problemCluster = null,
  surface = "unknown",
  className,
  children
}) {
  function click() {
    trackEvent(problemSlug ? "problem_lp_click" : "problem_hub_click", {
      href,
      problem_slug: problemSlug,
      problem_cluster: problemCluster,
      source_surface: surface
    });
  }

  return <Link href={href} className={className} onClick={click}>{children}</Link>;
}
