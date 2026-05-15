"use client";

import type { FC } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, limit, query } from "firebase/firestore";

const staticCategories = [
  {
    name: "Residential",
    subName: "Landscape",
    href: "/projects/residential",
    bgImage:
      "https://cdn.gallinainnovations.com/uploads/PHOTO-2025-10-08-11-45-41_2_Cover.jpg",
  },
  {
    name: "Hospitality",
    subName: "Hotels & Villas",
    href: "/projects/hospitality",
    bgImage: "https://cdn.gallinainnovations.com/uploads/landing-9.jpg",
  },
  {
    name: "Commercial",
    subName: "Industrial",
    href: "/projects/commercial",
    bgImage:
      "https://cdn.gallinainnovations.com/uploads/mr.%20mendis%20%20%2812%29.JPEG",
  },
];

const PROPOSED_FALLBACK =
  "https://cdn.gallinainnovations.com/uploads/mr.%20mendis%20%20%2812%29.JPEG";

const SlidingProjectsSection: FC = () => {
  const [active, setActive] = useState<number | null>(null);
  const [proposedBg, setProposedBg] = useState(PROPOSED_FALLBACK);

  useEffect(() => {
    const fetchProposedImage = async () => {
      try {
        const snap = await getDocs(query(collection(db, "proposed"), limit(1)));
        if (!snap.empty) {
          const data = snap.docs[0].data();
          const imgs = Array.isArray(data.imageUrls) ? data.imageUrls : [];
          if (imgs[0]) setProposedBg(imgs[0]);
        }
      } catch {
        // keep fallback
      }
    };
    fetchProposedImage();
  }, []);

  const categories = [
    ...staticCategories,
    {
      name: "Proposed",
      subName: "2026 — Coming Soon",
      href: "/proposed",
      bgImage: proposedBg,
    },
  ];

  return (
    <motion.div
      className="relative lg:h-[120vh]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* ── Desktop: sticky full-viewport accordion ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden hidden md:flex flex-row">
        {categories.map((category, i) => {
          const isActive = active === i;
          const isDimmed = active !== null && !isActive;

          return (
            <Link
              key={category.name}
              href={category.href}
              className="relative overflow-hidden block no-underline"
              style={{
                flex: isActive ? "3.5" : isDimmed ? "0.55" : "1",
                transition: "flex 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${category.bgImage})`,
                  opacity: 0.25,
                  filter: "grayscale(50%)",
                  WebkitFilter: "grayscale(50%)",
                }}
                aria-hidden="true"
              />

              {/* Bottom gradient — keeps text legible */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.38) 45%, transparent 100%)",
                  opacity: isActive ? 1 : 0.55,
                  transition: "opacity 0.6s ease",
                }}
                aria-hidden="true"
              />

              {/* Top vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 30%)",
                }}
                aria-hidden="true"
              />

              {/* Right hairline divider */}
              <div
                className="absolute top-0 right-0 bottom-0 w-px bg-white/10"
                aria-hidden="true"
              />

              {/* ── Text block — centered ── */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 pointer-events-none">
                {/* Subname — fades in on expand */}
                <span
                  className="text-[10px] tracking-[0.3em] uppercase text-[var(--brown1)]/65 mb-4 block text-center"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
                  }}
                >
                  {category.subName}
                </span>

                {/* Category name — always visible, grows on expand */}
                <h2
                  className="font-light text-white tracking-tight leading-none drop-shadow-lg text-center"
                  style={{
                    fontSize: isActive ? "clamp(3.5rem, 6vw, 6rem)" : "clamp(2.2rem, 3.5vw, 4rem)",
                    opacity: isDimmed ? 0 : 1,
                    transform: isDimmed ? "translateY(6px)" : "translateY(0)",
                    transition: "font-size 0.65s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s ease, transform 0.35s ease",
                    marginBottom: isActive ? "2.5rem" : "0",
                  }}
                >
                  {category.name}
                </h2>

                {/* CTA pill — only visible when expanded */}
                <div
                  className="inline-flex items-center gap-3 border border-white/22 text-white text-[10px] tracking-[0.22em] uppercase px-6 py-3 rounded-full self-center backdrop-blur-sm bg-white/[0.04] pointer-events-auto transition-colors duration-300 hover:border-[var(--brown1)] hover:text-[var(--brown1)]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  View Projects
                  <ArrowRight size={11} strokeWidth={1.5} />
                </div>
              </div>

              {/* Step index — top-right corner, always */}
              <span
                className="absolute top-8 right-8 text-[10px] tracking-[0.22em] text-white/20 font-light"
                style={{
                  opacity: isActive ? 0 : isDimmed ? 0.15 : 0.5,
                  transition: "opacity 0.4s ease",
                }}
              >
                0{i + 1}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── Mobile: stacked cards ── */}
      <div className="flex md:hidden flex-col w-full">
        {categories.map((category, i) => (
          <Link
            key={category.name}
            href={category.href}
            className="relative overflow-hidden block no-underline"
            style={{ height: "38vh" }}
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${category.bgImage})`,
                opacity: 0.38,
                filter: "grayscale(40%)",
              }}
              aria-hidden="true"
            />
            {/* Gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            {/* Bottom divider */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" aria-hidden="true" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-7">
              <span className="block text-[9px] tracking-[0.28em] uppercase text-[var(--brown1)]/55 mb-2 text-center">
                {category.subName}
              </span>
              <h2 className="text-5xl font-light text-white tracking-tight leading-none text-center mb-6">
                {category.name}
              </h2>
              <div className="flex items-center gap-2 border border-white/20 text-white text-[9px] tracking-[0.18em] uppercase px-4 py-2.5 rounded-full bg-black/20 backdrop-blur-sm">
                View
                <ArrowRight size={10} strokeWidth={1.5} />
              </div>
            </div>

            {/* Index */}
            <span className="absolute top-6 right-6 text-[9px] tracking-[0.22em] text-white/20">
              0{i + 1}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default SlidingProjectsSection;
