import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Gallina Innovations",
  description: "Explore featured projects by Gallina Innovations, showcasing sustainable architecture and design in Sri Lanka across residential, hospitality, and commercial spaces.",
  alternates: {
    canonical: "https://gallinainnovations.com/projectShowcase"
  }
};

import React, { Suspense } from "react";
import Loading from "@/components/Loading";
import ProjectShowcaseClient from "@/components/ProjectShowcaseClient";

export default function ProjectShowcase() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loading /></div>}>
      <ProjectShowcaseClient />
    </Suspense>
  );
}
