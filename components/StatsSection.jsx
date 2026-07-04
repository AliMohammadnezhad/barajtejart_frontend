"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/data/site";

/** شمارندهٔ متحرک — با ورود به دید کاربر از صفر تا مقدار نهایی می‌شمارد */
function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic برای پایان نرم شمارش
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-4xl font-black text-accent-400 sm:text-5xl">
      {count.toLocaleString("fa-IR")}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-primary-950 py-20">
      <div className="container-site grid grid-cols-2 gap-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="mt-3 font-medium text-slate-300">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
