"use client";

import type { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Residential",
    subName: "Landscape",
    href: "#",
    bgImage: "https://cdn.gallinainnovations.com/uploads/landing-4.jpg",
    bgColor: "neutral-500",
    textColor: "text-white",
    borderColor: "border-white/30",
    hoverBgColor: "hover:bg-white",
  },
  {
    name: "Hospitality",
    subName: "",
    href: "#",
    bgImage: "https://cdn.gallinainnovations.com/uploads/landing-9.jpg",
    bgColor: "neutral-500",
    textColor: "text-white",
    borderColor: "border-white/30",
    hoverBgColor: "hover:bg-white/5",
  },
  {
    name: "Commercial",
    subName: "Industrial",
    href: "#",
    bgImage: "https://res.cloudinary.com/vectorworks/image/upload/f_auto,q_auto/v1727985220/article/what-is-landscape-architecture/Yuqin_Garden_PLACEMEDIA_LAC_P1_bird_eye.jpg",
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
        {categories.map((category) => {
          // Map display name to Section type for scroll
          let sectionName: string = category.name;
          if (sectionName === "Commercial") sectionName = "Commercial";
          if (sectionName === "Residential") sectionName = "Residential";
          if (sectionName === "Landscape") sectionName = "Residential";
          if (sectionName === "Hospitality") sectionName = "Hospitality"; // fallback or adjust as needed

          return (
            <motion.div
              key={category.name}
              whileHover="hover"
              initial="rest"
              animate="rest"
              variants={{}}
              className={`group relative flex flex-1 flex-col md:items-center justify-between p-8 transition-colors duration-300 ease-in-out ${category.textColor}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                (window as Window & { scrollToProjectCategory?: (section: string) => void }).scrollToProjectCategory?.(sectionName);
              }}
            >
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
                  background: category.bgColor.startsWith('neutral') ? 'var(--brown2)' : 'rgba(0,0,0,0.7)',
                }}
                variants={{
                  rest: { y: '100%', opacity: 0.6 },
                  hover: { y: '0%', opacity: 0.8, transition: { duration: 0.5 } },
                }}
                transition={{ duration: 0.5 }}
              />

              {/* content above overlay */}
              <div className="relative z-10 flex flex-1 w-full flex-col items-center justify-between"></div>
              <div
                className={`
                  absolute inset-x-8 md:top-1/2 md:-translate-y-1/2 z-10 flex flex-col
                  md:[writing-mode:vertical-rl] md:rotate-180
                  ${category.textColor}
                  tracking-tight drop-shadow-2xl gap-2
                `}
              >
                <span className="text-5xl font-medium md:text-8xl">{category.name}</span>
                <span className="md:mt-2 text-2xl md:text-5xl font-light opacity-70 text-left">{category.subName}</span>
              </div>
              <div
                className={`
                  flex h-16 w-16 items-center justify-center rounded-full border 
                  transition-transform duration-300 group-hover:scale-105
                  md:h-25 md:w-25 bg-black/20
                  ${category.borderColor}
                `}
              >
                <ArrowRight
                  size={50}
                  strokeWidth={1}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.section>
    </motion.div>
  );
};

export default SlidingProjectsSection;