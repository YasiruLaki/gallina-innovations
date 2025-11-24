"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import LandingPic from "../../public/dummy-landing-pic.jpg";
import Logo from "../../public/logo-white.png";

export default function Landing() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 2000); // delay by 2000ms instead of 100ms
    return () => clearTimeout(timer);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Background image with zoom */}
      <Image
        src="https://www.mosvoldhotels.com/wp-content/uploads/2025/06/mosvold-1920x1000-2.jpg"
        alt="Modern Architectural Building"
        fill
        priority
        className={`object-cover transition-transform duration-[5000ms] ease-out ${
          animate ? "scale-105" : "scale-100"
        }`}
        style={{ filter: "brightness(0.6) blur(1px)" }}
      />

      {/* Overlay fade-in */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-[var(--background)] to-black/20 transition-opacity duration-1000 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Logo fade-in */}
      <div className="absolute inset-0 flex items-center justify-center z-10 -translate-y-15">
        <div
          className={`text-center px-4 transition-all duration-1000 ease-out ${
            animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Image
            src={Logo}
            alt="Gallina Innovations Logo"
            width={990}
            height={175}
            className="mx-auto mb-4 max-w-[80vw] sm:max-w-[600px] h-auto"
            style={{ maxWidth: "80vw", height: "auto" }}
          />
        </div>
      </div>

      {/* Bottom content */}
      <div className="z-10 flex flex-col lg:flex-row justify-end lg:justify-between items-start lg:items-end px-4 sm:px-8 lg:px-16 pb-16 lg:pb-10 gap-8 absolute bottom-0 left-0 right-0 lg:relative lg:h-screen">
        {/* Left side - Text content */}
        <div className="space-y-4 flex-1 min-w-0">
          <h1
        className={`text-4xl sm:text-5xl lg:text-7xl !font-light text-white leading-tight transform transition-all duration-1000 delay-300 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
          >
        Built with purpose
          </h1>
          <p
        className={`text-base sm:text-lg lg:text-xl !font-light text-white leading-relaxed opacity-90 max-w-full sm:max-w-lg transition-all duration-1000 delay-500 ${
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
          } ${"mt-8 lg:mt-0"}`}
        >
          <div onClick={scrollToNext} className="relative group cursor-pointer">
            {/* Outer circle */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white/50 transition-colors duration-300 animate-pulse">
              {/* Arrow */}
              <svg
                className="w-10 h-10 sm:w-15 sm:h-15 text-white group-hover:translate-y-1 group-hover:rotate-6 transition-transform duration-300"
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
