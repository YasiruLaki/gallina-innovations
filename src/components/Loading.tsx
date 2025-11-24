"use client";

import React, { useEffect, useState } from "react";

export default function FullscreenWebmLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      // start fade-out
      setFadeOut(true);
      document.body.style.overflow = originalOverflow; // unlock scroll immediately
      setTimeout(() => setLoading(false), 500); // remove after fade
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow; // ensure cleanup
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={() => {
          setFadeOut(true);
          document.body.style.overflow = ""; // unlock scroll when video ends
          setTimeout(() => setLoading(false), 500);
        }}
        className="w-full h-full object-cover"
      >
        <source src="/LogoBumper.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}