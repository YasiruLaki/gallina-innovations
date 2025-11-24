"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const images = [
  {
    src: "https://djpadb6zmchmi.cloudfront.net/2025/10/coco-bay-unawatuna-Rectangle-5.jpg",
    alt: "Architectural structure with strong shadows",
    fallback: "https://placehold.co/800x600/1a1a1a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://images.trvl-media.com/lodging/12000000/11260000/11251400/11251319/69d5ee87.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium",
    alt: "Modern building with a tree",
    fallback: "https://placehold.co/800x600/3a3a3a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://static.travelated.com/storage/hotels3/848/848136/property/35204689581.webp?w=3840&webp.quality=75&format=webp&scale=down&mode=crop",
    alt: "Architectural structure with strong shadows",
    fallback: "https://placehold.co/800x600/1a1a1a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://q-xx.bstatic.com/xdata/images/hotel/max500/510936223.jpg?k=644b93181f0605016e919be07dd5133cc8781e2d8df0d620ac0969c7a47f59fd&o=",
    alt: "Modern building with a tree",
    fallback: "https://placehold.co/800x600/3a3a3a/e0e0e0?text=Image+Not+Found",
  },
  // ... you can add more images
];

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.5,
  });

  // Base text animation transforms
  const textOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  const textY = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [40, 0, 0, -40]
  );

  const textScale = useTransform(smoothProgress, [0, 0.5, 1], [0.97, 1, 0.97]);

  const textSkew = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["3deg", "0deg", "-3deg"]
  );

  // Individual highlight colors for each headline line
  // Shifted input ranges to highlight lines one by one
  const highlight1 = useTransform(
    smoothProgress,
    [0, 0.1, 0.3, 0.4],
    ["rgba(255,255,255,0.6)", "rgba(255,255,255,1)", "rgba(255,255,255,1)", "rgba(255,255,255,0.6)"]
  );

  const highlight2 = useTransform(
    smoothProgress,
    [0.25, 0.35, 0.55, 0.65],
    ["rgba(255,255,255,0.6)", "rgba(255,255,255,1)", "rgba(255,255,255,1)", "rgba(255,255,255,0.6)"]
  );

  const highlight3 = useTransform(
    smoothProgress,
    [0.5, 0.6, 0.85, 0.95],
    ["rgba(255,255,255,0.6)", "rgba(255,255,255,1)", "rgba(255,255,255,1)", "rgba(255,255,255,0.6)"]
  );

  // Horizontal ticker position moves based on scroll
  const tickerX = useTransform(smoothProgress, [0, 1], ["0%", "-55%"]);

  // Parallax scale effect on images
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <div
      ref={ref}
      className="min-h-screen p-8 sm:p-12 md:px-[80px] font-sans flex flex-col antialiased text-gray-200"
    >
      {/* Header Section */}
      <header className="mb-12 mx-auto">
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            scale: textScale,
            skewY: textSkew,
            color: highlight1,
          }}
          className="mb-2 flex items-center gap-x-4"
        >
          <div
            className="flex-grow border-b border-solid border-gray-500"
            aria-hidden="true"
          ></div>
          <h1 className="text-3xl md:text-4xl lg:text-[64px] font-medium whitespace-nowrap">
            Not just buildings, but
          </h1>
        </motion.div>

        <motion.h1
          style={{
            opacity: textOpacity,
            y: textY,
            scale: textScale,
            skewY: textSkew,
            color: highlight2,
          }}
          className="text-3xl md:text-4xl lg:text-[64px] font-medium mb-2"
        >
          ecosystems sketched with empathy, built
        </motion.h1>

        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            scale: textScale,
            skewY: textSkew,
            color: highlight3,
          }}
          className="mb-8 flex items-center gap-x-4"
        >
          <h1 className="text-3xl md:text-4xl lg:text-[64px] font-medium whitespace-nowrap">
            for longevity.
          </h1>
          <div
            className="flex-grow border-b border-solid border-gray-500"
            aria-hidden="true"
          ></div>
        </motion.div>
        <motion.p
          style={{
            opacity: textOpacity,
            y: textY,
            scale: textScale,
            skewY: textSkew,
          }}
          className="mt-[60px] text-lg md:text-[40px] text-[var(--brown1)] font-light leading-7 md:leading-12 text-right mx-auto"
        >
          We don’t just shape spaces. We nurture environments that last, evolve,
          and live in harmony with nature.
        </motion.p>
      </header>

      {/* Main - horizontal scrolling ticker */}
      <main className="flex-grow relative w-screen overflow-hidden -mx-8 sm:-mx-12 md:-mx-[80px]">
        <motion.div
          style={{ x: tickerX }}
          className="flex gap-8 whitespace-nowrap w-[200vw] will-change-transform"
        >
          {[...images, ...images].map((img, i) => (
            <motion.img
              key={i}
              src={img.src}
              alt={img.alt}
              className="inline-block w-[40vw] max-w-[400px] h-72 md:h-auto object-cover select-none grayscale-100"
              onError={(e) => {
                e.currentTarget.src = img.fallback;
              }}
              draggable={true}
              style={{
                scale: imageScale,
                transformOrigin: "center center",
              }}
            />
          ))}
        </motion.div>
      </main>

      {/* Scroll hint / arrow */}
      <div className="-translate-y-15 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-100">
        <div className="flex items-center justify-center w-30 h-30 border-2 border-[var(--grey2)] rounded-full cursor-pointer hover:bg-[var(--grey3)] hover:cursor-pointer hover:border-gray-500 transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.75}
            stroke="currentColor"
            className="w-10 h-20 text-[var(--grey1)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default App;