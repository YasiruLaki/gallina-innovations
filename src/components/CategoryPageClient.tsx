"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Loading from "@/components/Loading";
import MobileMenu from "@/components/MobileMenu";
import CustomCursor from "@/components/CustomCursor";
import DustOverlay from "@/components/dustOverlay";
import ContactPage from "@/components/contactUs";
import CopyrightFooter from "@/components/footer";
import FeaturedProjectSection, { FirestoreProject as FeaturedFirestoreProject } from "@/components/FeaturedProjectSection";

type FirestoreProject = {
  id?: string;
  title: string;
  location: string;
  tags?: string[];
  category?: string;
  imageUrls?: string[];
};

const categoryMeta: Record<
  string,
  { label: string; sub: string; bgImage: string }
> = {
  residential: {
    label: "Residential",
    sub: "Landscape",
    bgImage:
      "https://cdn.gallinainnovations.com/uploads/PHOTO-2025-10-08-11-45-41_2_Cover.jpg",
  },
  hospitality: {
    label: "Hospitality",
    sub: "Hotels & Villas",
    bgImage: "https://cdn.gallinainnovations.com/uploads/landing-9.jpg",
  },
  commercial: {
    label: "Commercial",
    sub: "Industrial",
    bgImage:
      "https://cdn.gallinainnovations.com/uploads/mr.%20mendis%20%20%2812%29.JPEG",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay: i * 0.07 },
  }),
};

interface Props {
  category: string;
}

const CategoryPageClient: React.FC<Props> = ({ category }) => {
  const router = useRouter();
  const meta = categoryMeta[category.toLowerCase()];
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadProject, setLeadProject] = useState<FeaturedFirestoreProject | null>(null);

  useEffect(() => {
    if (!meta) return;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "projects"),
          where("category", "==", meta.label)
        );
        const snap = await getDocs(q);
        setProjects(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as FirestoreProject) }))
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    // Fetch lead project for hospitality
    if (category.toLowerCase() === "hospitality") {
      const lq = query(
        collection(db, "projects"),
        where("title", "==", "Mosvold Villa")
      );
      getDocs(lq).then((snap) => {
        if (!snap.empty) {
          setLeadProject(snap.docs[0].data() as FeaturedFirestoreProject);
        }
      });
    }
  }, [meta, category]);

  if (!meta) {
    router.push("/");
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-white font-sans">
      <DustOverlay />
      <CustomCursor />
      <MobileMenu />

      {/* ── Hero ── */}
      <section className="relative w-full h-[55vh] min-h-[340px] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${meta.bgImage})`,
            opacity: 0.22,
            filter: "grayscale(55%)",
          }}
          aria-hidden="true"
        />
        {/* Gradient fade to background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/20 via-transparent to-[var(--background)]"
          aria-hidden="true"
        />
        {/* Thin top border line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" aria-hidden="true" />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 md:px-16 pb-14">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-white/35 mb-7"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white/60 transition-colors duration-200">
              Home
            </Link>
            <span>/</span>
            <Link href="/#projects" className="hover:text-white/60 transition-colors duration-200">
              Projects
            </Link>
            <span>/</span>
            <span className="text-[var(--brown1)]">{meta.label}</span>
          </nav>

          {/* Title */}
          <motion.h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white tracking-tight leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {meta.label}
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/40 font-light mt-3 tracking-wide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          >
            {meta.sub}
          </motion.p>
        </div>
      </section>

      {/* ── Back link ── */}
      <div className="px-6 sm:px-12 md:px-16 pt-10 pb-8 border-b border-white/[0.06]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/35 hover:text-[var(--brown1)] transition-colors duration-300 group"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          Back to overview
        </Link>
      </div>

      {/* ── Lead Project (Hospitality only) ── */}
      {leadProject && <FeaturedProjectSection featured={leadProject} />}

      {/* ── Project grid ── */}
      <main className="px-6 sm:px-12 md:px-16 pt-14 pb-28">
        {loading ? (
          <div className="flex items-center justify-center py-36">
            <Loading />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-white/30 text-lg py-20 tracking-wide">
            No projects in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {projects.map((project, i) => (
              <motion.div
                key={project.id || project.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="cursor-pointer group"
                onClick={() =>
                  router.push(
                    `/projectShowcase?name=${encodeURIComponent(project.title)}`
                  )
                }
              >
                {/* Image */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-900 mb-5">
                  {project.imageUrls?.[0] && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${project.imageUrls[0]})`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors duration-500" />

                  {/* Hover CTA */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 border border-white/30 text-white text-[10px] tracking-[0.18em] uppercase px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0 bg-black/20 backdrop-blur-sm">
                    View
                    <ArrowRight size={10} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Meta */}
                <h3 className="text-xl sm:text-2xl font-light text-white/75 group-hover:text-white transition-colors duration-300 leading-snug">
                  {project.title}
                </h3>
                <p className="text-sm text-white/35 mt-1.5 tracking-wide">
                  {project.location}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-wide border border-zinc-700/70 text-zinc-500 px-3 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <ContactPage />
      <CopyrightFooter />
    </div>
  );
};

export default CategoryPageClient;
