"use client";

import React, { useRef, useEffect } from "react";

export default function AnimatedNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let frame = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imageData.data.buffer);

      // Flicker factor oscillates between 0.5 and 1
      const flicker = 0.75 + 0.25 * Math.sin(frame * 0.1);

      for (let i = 0; i < buffer.length; i++) {
        // Base alpha from 40 to 80 scaled by flicker
        const baseAlpha = 40 + Math.random() * 40;
        const alpha = Math.floor(baseAlpha * flicker);

        // Black noise with varying alpha channel
        buffer[i] = (alpha << 24);
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const render = () => {
      frame++;
      generateNoise();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [frame]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "screen", opacity: 0.45 }}
    />
  );
}