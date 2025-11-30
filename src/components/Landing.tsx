"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../public/logo-white.png";

export default function Landing() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 2000); 
    return () => clearTimeout(timer);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const [slides, setSlides] = useState<string[]>([
    "https://cdn.gallinainnovations.com/uploads/landing-1.jpg",
    "https://cdn.gallinainnovations.com/uploads/landing-2.jpg",
    "https://cdn.gallinainnovations.com/uploads/landing-3.jpg",
    "https://cdn.gallinainnovations.com/uploads/landing-4.jpg",
    "https://cdn.gallinainnovations.com/uploads/landing-5.jpg",
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadSlidesFromFirestore() {
      try {
        // dynamic import to avoid bundling if you don't use Firebase elsewhere
        const firebaseApp = await import("firebase/app");
        const { initializeApp, getApps } = firebaseApp;
        const firestoreMod = await import("firebase/firestore");
        const { getFirestore, doc, getDoc } = firestoreMod;

        const db = getFirestore();
        const ref = doc(db, "siteSettings", "landing");
        const snap = await getDoc(ref);

        if (!mounted) return;

        if (snap.exists()) {
          const data = snap.data() as Record<string, any>;
          // expect an array field like `images` (or fallback to `slides`)
          const imgs = Array.isArray(data?.images) ? data.images : Array.isArray(data?.slides) ? data.slides : [];
          if (imgs.length) setSlides(imgs);
        } else {
          console.warn("Firestore: 'siteSettings/landing' document not found");
        }
      } catch (err) {
        console.error("Failed to load slides from Firestore:", err);
      }
    }

    loadSlidesFromFirestore();
    return () => {
      mounted = false;
    };
  }, []);

  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((s) => (s + 1) % slides.length);
    }, 1500); // 1.5s per slide
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative sm:min-h-screen min-h-[90vh] max-h-screen overflow-hidden flex flex-col">
      {/* Slideshow background */}
      {slides.map((src, idx) => (
      <div
        key={src}
        className={`absolute inset-0 transition-opacity duration-700 ease-out transform-gpu ${
        slideIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        }`}
        style={{ willChange: "opacity, transform" }}
      >
        <Image
        src={src}
        alt={`Slide ${idx + 1}`}
        fill
        priority={slideIndex === idx}
        className={`object-cover w-full h-full transition-transform duration-[1500ms] ease-out  ${
          slideIndex === idx ? "scale-105" : "scale-100"
        }`}
        style={{ filter: "brightness(0.7) blur(0.1px)" }}
        />
      </div>
      ))}

      {/* Overlay fade-in */}
      <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-[10] bg-gradient-to-t from-[var(--background)] via-[var(--background)]/1 to-transparent transition-opacity duration-1000 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
      />
      <div
      id="landing-logo"
      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all duration-300 sm:translate-y-0 -translate-y-10"
      >
      <div
        id="landing-logo-inner"
        className={`text-center transition-all duration-300 ease-out ${
        animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } max-w-[90vw] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[990px] mx-auto px-2 sm:px-0`}
        style={{
        willChange: "transform, opacity",
        transformOrigin: "center center",
        }}
      >
        <Image
        src={Logo}
        alt="Gallina Innovations Logo"
        width={990}
        height={175}
        className="w-full h-auto drop-shadow-2xl drop-shadow-black/80 sm:px-8 lg:px-16"
        />
      </div>
      </div>

      <div
      id="logo-gradient-overlay"
      className="inset-0 pointer-events-none fixed"
      style={{ zIndex: 20 }}
      />

      <script
      dangerouslySetInnerHTML={{
        __html: `
        (function () {
        var overlay = document.getElementById('logo-gradient-overlay');
        if (!overlay) return;
        var maxScroll = 300;
        function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
        function lerp(a, b, t) { return a + (b - a) * t; }
        var ticking = false;
        function update() {
          var s = clamp(window.scrollY, 0, maxScroll);
          var t = s / maxScroll;
          var topAlpha = lerp(0, 0.85, t);
          var fadePoint = Math.round(lerp(25, 70, t));
          overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,' + topAlpha + ') 0%, rgba(0,0,0,0)20%)';
          overlay.style.opacity = String(lerp(0, 1, t));
          ticking = false;
        }
        function onScroll() {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(update);
        }
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', function () { update(); }, { passive: true });
        })();
        `,
      }}
      />

      {/* Bottom content */}
      <div className="z-10 flex flex-col sm:flex-row justify-end lg:justify-between items-start lg:items-end px-4 sm:px-8 lg:px-16  pb-16 md:pb-12 lg:pb-10 md:gap-8 absolute bottom-0  left-0 right-0 lg:relative lg:h-screen">
      {/* Left side - Text content */}
      <div className="space-y-4 flex-1 min-w-0">
        <h1
        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl !font-light text-white leading-tight transform transition-all duration-1000 delay-300 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        >
        Built with purpose
        </h1>
        <p
        className={`text-md sm:text-base md:text-lg lg:text-xl !font-light text-white sm:leading-relaxed opacity-90 max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl transition-all duration-1000 delay-500 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        >
        From humble nests to iconic spaces,
        <br />
        we bring imagination to life in every structure.
        </p>
      </div>

      {/* Arrow circle - always visible, stacks below text on mobile */}
      <div
        className={`flex items-center justify-center transition-all duration-1000 delay-700 ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } mt-8 md:mt-4 lg:mt-0`}
      >
        <div onClick={scrollToNext} className="relative group cursor-pointer">
        {/* Outer circle */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-40 lg:h-40 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white/50 transition-colors duration-300 animate-pulse">
          {/* Arrow */}
          <svg
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-15 lg:h-15 text-white group-hover:translate-y-1 group-hover:rotate-6 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={0.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
          </svg>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 w-full h-full rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
      </div>
    </div>
  );
}
