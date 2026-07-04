"use client";

import { motion } from "framer-motion";

/**
 * ظاهر شدن نرم عناصر هنگام اسکرول.
 * دور هر بلوکی که باید انیمیشن داشته باشد پیچیده می‌شود.
 */
export default function Reveal({ children, delay = 0, y = 28, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
