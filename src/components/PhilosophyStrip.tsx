"use client";

import { useEffect, useRef, useState } from "react";

export default function PhilosophyStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full bg-[var(--background)] py-20 md:py-28 px-6 sm:px-12 md:px-20 flex flex-col items-center justify-center text-center border-y border-white/10"
    >
      <p
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[var(--brown1)] leading-snug tracking-wide max-w-4xl transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        &ldquo;Architecture as a quiet dialogue between space, character, and context.&rdquo;
      </p>
      <p
        className={`mt-6 text-sm sm:text-base md:text-lg font-light text-white/50 tracking-widest uppercase transition-all duration-1000 delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Residential, hospitality, and commercial projects &mdash; across Sri Lanka and beyond.
      </p>
    </section>
  );
}
