"use client";
import React from "react";
import { Noise } from "react-noise";

const GrainyNoiseOverlay: React.FC = () => (
  <div
    style={{
      pointerEvents: "none",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
      opacity: 0.18,
      mixBlendMode: "overlay",
    }}
    aria-hidden="true"
  >
    <Noise
      opacity={0.45}
    />
  </div>
);

export default GrainyNoiseOverlay;