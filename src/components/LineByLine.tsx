"use client";
import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const child = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function LineByLine({ text, className }: { text: string; className?: string }) {
  // Split by newline first, then fallback to sentence split
  const lines = text.split("\n").flatMap((t) => {
    if (t.trim().length === 0) return [];
    // split by sentence end (keep punctuation)
    return t.split(/(?<=[.!?])\s+/);
  });

  return (
    <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }} className={className}>
      {lines.map((line, idx) => (
        <motion.div key={idx} variants={child} className="overflow-hidden">
          <motion.span className="block">{line}</motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}
