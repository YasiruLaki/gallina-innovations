"use client";

import React, { useRef, useEffect } from "react";

export default function AnimatedNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw at 1/4 resolution — canvas CSS stretches it back up.
    // Quarter-res = 1/16 the pixel count → ~16× cheaper to fill.
    const SCALE = 0.25;
    let animationFrameId: number;
    let lastTime = 0;
    // Target ~12 fps for the noise (imperceptible at this opacity)
    const INTERVAL = 1000 / 12;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * SCALE);
      canvas.height = Math.floor(window.innerHeight * SCALE);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (now - lastTime < INTERVAL) return;
      lastTime = now;

      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const buf = new Uint32Array(imageData.data.buffer);
      const len = buf.length;
      for (let i = 0; i < len; i++) {
        // Cheap random: only alpha varies, colour is always black
        buf[i] = ((40 + (Math.random() * 40 | 0)) << 24);
      }
      ctx.putImageData(imageData, 0, 0);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        width: "100vw",
        height: "100vh",
        mixBlendMode: "screen",
        opacity: 0.45,
        imageRendering: "pixelated",
      }}
    />
  );
}
