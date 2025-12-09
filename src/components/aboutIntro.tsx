"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const images = [
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-1.jpg",
    alt: "Architectural structure with strong shadows",
    fallback: "https://placehold.co/800x600/1a1a1a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-2.jpg",
    alt: "Modern building with a tree",
    fallback: "https://placehold.co/800x600/3a3a3a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-3.jpg",
    alt: "Architectural structure with strong shadows",
    fallback: "https://placehold.co/800x600/1a1a1a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-4.jpg",
    alt: "Modern building with a tree",
    fallback: "https://placehold.co/800x600/3a3a3a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-5.jpg",
    alt: "Architectural structure with strong shadows",
    fallback: "https://placehold.co/800x600/1a1a1a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-6.jpg",
    alt: "Modern building with a tree",
    fallback: "https://placehold.co/800x600/3a3a3a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-7.jpg",
    alt: "Architectural structure with strong shadows",
    fallback: "https://placehold.co/800x600/1a1a1a/e0e0e0?text=Image+Not+Found",
  },
  {
    src: "https://cdn.gallinainnovations.com/uploads/abt-new-8.jpg",
    alt: "Modern building with a tree",
    fallback: "https://placehold.co/800x600/3a3a3a/e0e0e0?text=Image+Not+Found",
  }
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

  // (ticker and image scale are computed locally inside the Ticker component)

  return (
    <div
      ref={ref}
      className="sm:p-8 px-4 sm:px-8 lg:px-16 font-sans flex flex-col antialiased text-gray-200"
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
            className=" flex-grow border-b border-solid border-gray-500"
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
          className="text-3xl md:text-4xl lg:text-[64px] font-medium mb-1"
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
          className="sm:mt-[60px] sm:text-2xl text-xl md:text-[40px] text-[var(--brown1)] font-light leading-7 md:leading-12 text-right mx-auto"
        >
          We don’t just shape spaces. We nurture environments that last, evolve,
          and live in harmony with nature.
        </motion.p>
      </header>

      {/* Main - horizontal scrolling ticker */}
      <main className="flex-grow relative w-screen overflow-hidden -mx-8 sm:-mx-12 md:-mx-[80px]">
        {(() => {
          const Ticker: React.FC = () => {
            const speedFactor = 1;
            const end = `${-55 * speedFactor}%`;
            const localTickerX = useTransform(smoothProgress, [0, 1], ["0%", end]);
            const localImageScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.05, 1]);

            return (
              <motion.div
                style={{ x: localTickerX }}
                className="flex gap-8 whitespace-nowrap w-[200vw] will-change-transform"
              >
                {[...images, ...images].map((img, i) => (
                  <motion.img
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    className="inline-block w-[40vw] max-w-[400px] h-72 object-cover select-none grayscale-90 brightness-80 contrast-115"
                    onError={(e) => {
                      e.currentTarget.src = img.fallback;
                    }}
                    draggable={true}
                    style={{
                      scale: localImageScale,
                      transformOrigin: "center center",
                    }}
                  />
                ))}
              </motion.div>
            );
          };

          return <Ticker />;
        })()}
      </main>

      {/* Scroll hint / arrow */}
      <div className="sm:-translate-y-15 -translate-y-7 left-8 translate-x-4 md:left-8 md:translate-x-0 z-100">
        <div className="flex items-center justify-center sm:w-30 sm:h-30 w-20 h-20 border-1 border-[var(--grey2)] rounded-full cursor-pointer hover:bg-[var(--grey3)] hover:cursor-pointer hover:border-gray-500 transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.75}
            stroke="currentColor"
            className="w-12 h-20 text-[var(--grey1)]"
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