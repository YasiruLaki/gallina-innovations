"use client";
import React, { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Turn off native smooth behavior to avoid double-smoothing with Lenis
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    // Initialize Lenis for smooth scrolling
    // Keep options minimal to satisfy installed Lenis types
    const lenis = new Lenis({ duration: 1.0 });

    let rafId = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      // restore native scroll behavior
      document.documentElement.style.scrollBehavior = prevScrollBehavior || "";
      // cancel RAF and destroy lenis instance
      cancelAnimationFrame(rafId);
      try {
        lenis.destroy();
      } catch (e) {
        // ignore if already destroyed
      }
    };
  }, []);

  return <>{children}</>;
}
