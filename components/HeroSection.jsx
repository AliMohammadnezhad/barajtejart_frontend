"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { hero, siteConfig } from "@/data/site";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-primary-950 pt-20">
      {/* تصویر پس‌زمینه با لایهٔ تیره */}
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-primary-950 via-primary-950/80 to-primary-950/40" />

      <div className="container-site relative py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1.5 text-sm font-bold text-accent-400">
            <FaCheckCircle />
            {hero.badge}
          </span>

          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            {hero.title}
            <span className="mt-2 block text-accent-400">{hero.titleHighlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-9 text-slate-300">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label}
              <FaArrowLeft />
            </Link>
            <Link href={hero.secondaryCta.href} className="btn-outline">
              {hero.secondaryCta.label}
            </Link>
          </div>

          <p className="mt-10 text-sm text-slate-400">
            پاسخگویی {siteConfig.workingHours} —{" "}
            <a href={siteConfig.phoneLink} dir="ltr" className="font-bold text-accent-400">
              {siteConfig.phone}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
