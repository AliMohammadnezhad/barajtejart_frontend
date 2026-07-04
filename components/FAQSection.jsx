"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import SectionHeading from "@/components/SectionHeading";
import { faqs } from "@/data/site";

function FAQItem({ item, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
      >
        <span className="font-black text-primary-900">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className={`shrink-0 ${open ? "text-accent-500" : "text-slate-400"}`}
        >
          <FaChevronDown />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="border-t border-slate-100 px-6 py-5 text-sm leading-8 text-slate-500">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-slate-50 py-24">
      <div className="container-site max-w-4xl">
        <SectionHeading
          eyebrow="سوالات متداول"
          title="پاسخ پرسش‌های پرتکرار شما"
          subtitle="اگر پاسخ سوال‌تان را پیدا نکردید، کارشناسان ما آماده گفتگو هستند."
        />

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
