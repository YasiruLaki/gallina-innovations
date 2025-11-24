"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
        <Image
          src="/cursor.png"
          alt="Custom Cursor"
          style={{
            position: "fixed",
            top: pos.y,
            left: pos.x,
            width: 32,
            height: 32,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            mixBlendMode: "difference", // <-- blending mode here
          }}
          width={32}
          height={32}
        />
  );
};

export default CustomCursor;
