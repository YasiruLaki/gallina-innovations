import { Suspense } from "react";
import type { Metadata } from "next";
import Loading from "@/components/Loading";
import CategoryPageClient from "@/components/CategoryPageClient";

interface Props {
  params: Promise<{ category: string }>;
}

const categoryLabels: Record<string, { title: string; description: string }> = {
  residential: {
    title: "Residential Projects | Gallina Innovations",
    description:
      "Explore Gallina Innovations' residential portfolio — landscape and living spaces crafted across Sri Lanka, inspired by Colonial, Dutch, Balinese and Tropical design principles.",
  },
  hospitality: {
    title: "Hospitality Projects | Gallina Innovations",
    description:
      "Hotels, villas and retreat spaces by Gallina Innovations — architectural compositions built for hospitality across Sri Lanka and beyond.",
  },
  commercial: {
    title: "Commercial Projects | Gallina Innovations",
    description:
      "Commercial and industrial architectural work by Gallina Innovations — purposeful spaces designed for longevity across Sri Lanka.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryLabels[category.toLowerCase()];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://gallinainnovations.com/projects/${category}`,
    },
  };
}

export function generateStaticParams() {
  return [
    { category: "residential" },
    { category: "hospitality" },
    { category: "commercial" },
  ];
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      }
    >
      <CategoryPageClient category={category} />
    </Suspense>
  );
}
