"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Conversation",
    body: "A 30-minute discussion of your site, your brief, and your budget — to see if we're the right practice for the project.",
    note: "No fee, no obligation",
  },
  {
    number: "02",
    title: "Site & Brief",
    body: "We visit your site, study its character, and write the brief together — the document every subsequent decision answers to.",
    note: "2–3 weeks",
  },
  {
    number: "03",
    title: "Concept & Design",
    body: "Schematic plans, sectional studies, material palette. Refined through conversation until the design holds.",
    note: "6–10 weeks",
  },
  {
    number: "04",
    title: "Documentation & Build",
    body: "Detailed drawings, structural coordination, contractor selection. We oversee construction through completion.",
    note: "Project-dependent",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function HowWeWork() {
  const header = useInView(0.2);
  const steps1 = useInView(0.1);

  return (
    <section className="w-full bg-[var(--background)] px-6 sm:px-12 md:px-16 py-24 md:py-36 border-t border-white/[0.06]">

      {/* ── Heading block ── */}
      <div
        ref={header.ref}
        className={`mb-20 md:mb-28 max-w-3xl transition-all duration-1000 ${
          header.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-6">
          Process
        </p>
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight tracking-tight">
          How we work
        </h2>
        <p className="mt-6 text-base sm:text-lg md:text-xl font-light text-white/45 leading-relaxed max-w-xl">
          Every project begins with a conversation. What follows respects your time, your site, and your investment.
        </p>
      </div>

      {/* ── Steps ── */}
      <div ref={steps1.ref} className="w-full">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`
              group flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-12 md:gap-16
              border-t border-white/[0.07] py-10 md:py-12
              transition-all duration-700
              ${steps1.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
            `}
            style={{ transitionDelay: steps1.visible ? `${i * 120}ms` : "0ms" }}
          >
            {/* Step number */}
            <span className="text-[11px] tracking-[0.2em] text-white/20 font-light pt-1 shrink-0 w-10">
              {step.number}
            </span>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--brown1)] tracking-tight shrink-0 sm:w-56 md:w-72 leading-snug group-hover:text-white transition-colors duration-500">
              {step.title}
            </h3>

            {/* Body */}
            <p className="flex-1 text-base sm:text-lg font-light text-white/45 leading-relaxed">
              {step.body}
            </p>

            {/* Time note */}
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/25 font-light sm:text-right shrink-0 sm:w-36 md:w-44 pt-1">
              {step.note}
            </span>
          </div>
        ))}

        {/* Closing border */}
        <div className="border-t border-white/[0.07]" />
      </div>

      {/* ── Bridge sentence ── */}
      <div
        className={`mt-20 md:mt-24 flex flex-col sm:flex-row sm:items-end justify-between gap-8 transition-all duration-1000 delay-500 ${
          steps1.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-base sm:text-lg md:text-xl font-light text-white/40 leading-relaxed max-w-xl">
          Every project starts with step one. If you&apos;re considering a residential,
          hospitality, or commercial project, we&apos;d be glad to talk.
        </p>

        <Link
          href="#contactUs"
          className="inline-flex items-center gap-3 border border-white/20 text-white/60 hover:border-[var(--brown1)] hover:text-[var(--brown1)] transition-all duration-400 rounded-full px-7 py-3.5 text-[11px] tracking-[0.2em] uppercase font-light group shrink-0"
        >
          Start the conversation
          <ArrowRight
            size={12}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </Link>
      </div>
    </section>
  );
}
