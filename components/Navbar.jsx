"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaPhoneAlt, FaTimes, FaTruckMoving } from "react-icons/fa";
import { navLinks, siteConfig } from "@/data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // بستن منوی موبایل هنگام تغییر صفحه
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-primary-950/95 shadow-lg backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-20 items-center justify-between">
        {/* لوگو */}
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-500 text-primary-950">
            <FaTruckMoving className="text-xl" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black">{siteConfig.name}</span>
            <span className="block text-[11px] text-slate-300">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                isActive(link.href)
                  ? "text-accent-400"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={siteConfig.phoneLink}
            className="flex items-center gap-2 text-sm text-slate-200 hover:text-white"
          >
            <FaPhoneAlt className="text-accent-400" />
            <span dir="ltr">{siteConfig.phone}</span>
          </a>
          <Link href="/contact" className="btn-primary !px-5 !py-2.5 text-sm">
            درخواست مشاوره
          </Link>
        </div>

        {/* دکمه منوی موبایل */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl text-white lg:hidden"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-primary-950/95 backdrop-blur lg:hidden"
          >
            <div className="container-site flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-3 font-medium ${
                    isActive(link.href)
                      ? "bg-white/5 text-accent-400"
                      : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="btn-primary mt-3">
                درخواست مشاوره رایگان
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
