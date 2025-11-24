"use client";

import type { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Residential",
    href: "#",
    bgImage: "https://images.squarespace-cdn.com/content/v1/55037331e4b04b996323b3f9/1575867005057-IYMPWVRQ2J7RC18LKZM1/coxist-studio-austin-architect-jake-holt-photo-1.jpg",
    bgColor: "neutral-500",
    textColor: "text-white",
    borderColor: "border-white/30",
    hoverBgColor: "hover:bg-white",
  },
  {
    name: "Industrial",
    href: "#",
    bgImage: "https://worldarchitecture.org/cdnimgfiles/extuploadc/civicarchitectslochaltilburgcreditss-7-.jpg",
    bgColor: "neutral-500",
    textColor: "text-white",
    borderColor: "border-white/30",
    hoverBgColor: "hover:bg-white/5",
  },
  {
    name: "Landscape",
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
    <div  className="relative lg:h-[150vh]">
      <motion.section
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden md:flex-row"
      >
        {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              aria-label={category.name}
              className={`
              group relative flex flex-1 flex-col items-center justify-between p-8
              transition-colors duration-300 ease-in-out
              ${category.textColor}
              `}
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

              {/* colored overlay on top of the bg image */}
              <div
              className={`
                absolute inset-0
                transition-colors duration-300
                bg-${category.bgColor} ${category.hoverBgColor}
                pointer-events-none
                opacity-90
              `}
              aria-hidden="true"
              />
              {/* content above overlay */}
              <div className="relative z-10 flex flex-1 w-full flex-col items-center justify-between"></div>
            <h2
              className={`
              absolute inset-x-8 top-1/2 -translate-y-1/2 z-10 flex items-center
              text-3xl font-medium md:text-8xl
              md:[writing-mode:vertical-rl] md:rotate-180
              ${category.textColor}
              tracking-tight drop-shadow-2xl
              `}
            >
              {category.name}
            </h2>
            <div
              className={`
              flex h-16 w-16 items-center justify-center rounded-full border 
              transition-transform duration-300 group-hover:scale-105
              md:h-20 md:w-20 bg-black/20
              ${category.borderColor}
              `}
            >
              <ArrowRight size={32} />
            </div>
            </Link>
        ))}
      </motion.section>
    </div>
  );
};

export default SlidingProjectsSection;