"use client";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import ContactPage from "@/components/contactUs";
import CopyrightFooter from "@/components/footer";
import LineByLine from "@/components/LineByLine";
import MobileMenu from "@/components/MobileMenu";

import Loading from "@/components/Loading";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const textContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const textChild = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

const AboutUs: FC = () => {
  const [animate, setAnimate] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const inView = useInView(heroRef, { amount: 0.3, once: true });

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div className=" bg-[var(--background)] text-white font-sans">
      <Loading />
      <MobileMenu />
      {/* Section 1: Hero */}
      <motion.section
        ref={heroRef}
        className="relative h-[60vh] md:h-[80vh] w-full flex items-end p-8 md:p-16 lg:p-24 overflow-hidden"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={sectionVariants}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Background Image with Overlay (static - no animations) */}
        <div className="absolute inset-0">
          <Image
            src="https://assets.architecturaldigest.in/photos/631901edac6d3139777df6dd/16:9/w_2560%2Cc_limit/Sustainability-featured.jpg"
            alt="Modern architectural interior with a curved concrete wall and a tree"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/15"></div>
        </div>

        {/* Hero Text */}
        <motion.div className="relative z-10 max-w-6xl">
          {/* Line-by-line reveal for the heading */}
          <LineByLine
            text={"Our architecture is a dialogue between\npencil and planet, vision and values."}
            className="text-4xl md:text-6xl !font-light tracking-tight leading-tight md:leading-[1.1] lg:text-7xl lg:leading-[1.05]"
          />
        </motion.div>

        {/* Right side - Arrow circle */}
        <motion.div
          className={`hidden lg:flex items-center justify-center transition-all ${animate ? "opacity-100 translate-y-40" : "opacity-0 translate-y-10"}`}
          initial={{ opacity: 0, y: 50 }}
          animate={animate ? { opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.6 } } : {}}
          role="button"
          tabIndex={0}
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <div className="relative group cursor-pointer">
            <div className="w-40 h-40 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white/50 transition-colors duration-300">
              <motion.svg
          className="w-15 h-15 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={{ y: 0 }}
          whileHover={{ y: 4, rotate: 6 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </div>

            <div className="absolute inset-0 w-40 h-40 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Section 2: Intro */}
      <motion.section className="py-16 md:py-24 px-8 md:px-16 lg:px-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
        <motion.h2 className="text-5xl md:text-7xl font-medium tracking-tighter mb-12">Intro</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 items-center">
          {/* Image */}
          <motion.div className="relative w-full h-64 md:h-auto md:aspect-square lg:col-span-2 overflow-hidden" initial={{ scale: 0.98, opacity: 0 }} whileInView={{ scale: 1, opacity: 1, transition: { duration: 0.8 } }} viewport={{ once: true }}>
            <Image src="/abtBG.png" alt="The first studio of Prasanna Gunawardana in a garage with a classic car" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw" />
          </motion.div>

          {/* Text Content - reveal sentences line-by-line, preserve highlighted name */}
          <motion.div className="lg:col-span-3" variants={textContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {(() => {
              const p1 = `At its core, Gallina Innovations is a design philosophy that reflects lifelong expression of a deep, instinctive understanding of space and character. The story begins with <span class="text-white font-medium">Prasanna Gunawardana</span>, who, from a young age, had an uncanny ability to visualize and design. He went from designing his childhood bedroom to opening his first studio space in a garage in 1996.`;
              const p2 = `Long before Gallina became a formal studio, Prasanna was transforming living and work spaces for friends and family. With no formal training, only an innate sense of proportion and flow, his designs began speaking for themselves. What began as instinctive, one-off commissions has grown into a practice recognized for its spatial clarity, intentional minimalism, and legacy-led approach.`;

              return (
                <>
                  <motion.p
                    className="text-base font-light md:text-xl text-neutral-300 leading-relaxed mb-4"
                    variants={textChild}
                    dangerouslySetInnerHTML={{ __html: p1 }}
                  />
                  <motion.p
                    className="text-base md:text-lg text-neutral-300 leading-relaxed mb-4"
                    variants={textChild}
                    dangerouslySetInnerHTML={{ __html: p2 }}
                  />
                </>
              );
            })()}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Manifesto */}
      <motion.section className="px-8 md:px-[96px] py-8 md:py-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
        <div className="flex-grow border-b border-solid border-gray-500 mb-6" aria-hidden="true"></div>
        <motion.h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[var(--brown1)]">
          Rooted in sustainability, drawn with soul. We build spaces that give back.
        </motion.h2>
        <div className="flex-grow border-b border-solid border-gray-500 mt-6" aria-hidden="true"></div>
      </motion.section>

      {/* Contact Us Section */}
      <ContactPage />

      {/* Footer */}
      <CopyrightFooter />
    </motion.div>
  );
};

export default AboutUs;
