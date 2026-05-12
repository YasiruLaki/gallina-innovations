"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 32,
        height: 32,
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    >
      <Image
        src="/cursor.png"
        alt="Custom Cursor"
        width={32}
        height={32}
        style={{ mixBlendMode: "difference" }}
      />
    </div>
  );
};

export default CustomCursor;
