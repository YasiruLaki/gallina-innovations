"use client";

import type { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Residential",
    subName: "Landscape",
    href: "/projects/residential",
    bgImage: "https://cdn.gallinainnovations.com/uploads/PHOTO-2025-10-08-11-45-41_2_Cover.jpg",
    bgColor: "neutral-500",
    textColor: "text-white",
    borderColor: "border-white/30",
    hoverBgColor: "hover:bg-white",
  },
  {
    name: "Hospitality",
    subName: "Hotels & Villas",
    href: "/projects/hospitality",
    bgImage: "https://cdn.gallinainnovations.com/uploads/landing-9.jpg",
    bgColor: "neutral-500",
    textColor: "text-white",
    borderColor: "border-white/30",
    hoverBgColor: "hover:bg-white/5",
  },
  {
    name: "Commercial",
    subName: "Industrial",
    href: "/projects/commercial",
    bgImage: "https://cdn.gallinainnovations.com/uploads/mr.%20mendis%20%20%2812%29.JPEG",
    bgColor: "neutral-500",
    textColor: "text-white",
    borderColor: "border-white/30",
    hoverBgColor: "hover:bg-white",
  },
];

const SlidingProjectsSection: FC = () => {
  return (
    <motion.div
      className="relative lg:h-[120vh]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.section
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden md:flex-row"
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className={`group relative flex flex-1 flex-col md:items-center justify-between p-8 transition-colors duration-300 ease-in-out ${category.textColor} no-underline`}
          >
            <motion.div
              whileHover="hover"
              initial="rest"
              animate="rest"
              variants={{}}
              className="absolute inset-0"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${category.bgImage})`,
                  opacity: 0.25,
                  filter: "grayscale(50%)",
                  WebkitFilter: "grayscale(50%)",
                }}
                aria-hidden="true"
              />

              {/* Sliding overlay on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'var(--brown2)',
                }}
                variants={{
                  rest: { y: '100%', opacity: 0.6 },
                  hover: { y: '0%', opacity: 0.8, transition: { duration: 0.5 } },
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Category text — vertical on desktop */}
            <div
              className={`
                absolute inset-x-8 md:top-1/2 md:-translate-y-1/2 z-10 flex flex-col
                md:[writing-mode:vertical-rl] md:rotate-180
                ${category.textColor}
                tracking-tight drop-shadow-2xl gap-2
                group-hover:text-black transition-colors duration-500
              `}
            >
              <span className="text-5xl font-medium md:text-8xl">{category.name}</span>
              <span className="md:mt-2 text-2xl md:text-5xl font-light opacity-70 text-left group-hover:opacity-90">{category.subName}</span>
            </div>

            {/* View Projects button */}
            <div className="relative z-10 mt-auto self-end md:self-auto">
              <div
                className={`
                  flex items-center gap-2.5 border rounded-full px-5 py-2.5
                  transition-all duration-500
                  border-white/30 text-white
                  group-hover:border-black group-hover:text-black group-hover:bg-transparent
                `}
              >
                <span className="text-xs tracking-[0.18em] uppercase font-light whitespace-nowrap">View Projects</span>
                <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </motion.section>
    </motion.div>
  );
};

export default SlidingProjectsSection;