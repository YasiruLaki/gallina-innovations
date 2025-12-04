import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor | Gallina Innovations",
  description: "Use the Gallina Innovations editor to explore and customize architectural projects. Experiment with design elements and visualize your ideas.",
  alternates: {
    canonical: "https://gallinainnovations.com/editor"
  }
};
"use client";
import React from "react";
import EditorPanel from "@/components/EditorPanel";

export default function EditorPage() {
  return <EditorPanel />;
}
