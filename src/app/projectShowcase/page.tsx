
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
