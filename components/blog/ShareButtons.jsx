"use client";

import { useState } from "react";
import {
  FaCheck,
  FaLink,
  FaLinkedinIn,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

/** دکمه‌های اشتراک‌گذاری مقاله در شبکه‌های اجتماعی */
export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const enc = encodeURIComponent;
  const links = [
    {
      id: "telegram",
      label: "اشتراک در تلگرام",
      icon: FaTelegramPlane,
      href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
    },
    {
      id: "whatsapp",
      label: "اشتراک در واتس‌اپ",
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${enc(`${title}\n${url}`)}`,
    },
    {
      id: "twitter",
      label: "اشتراک در ایکس (توییتر)",
      icon: FaTwitter,
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    },
    {
      id: "linkedin",
      label: "اشتراک در لینکدین",
      icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // مرورگر قدیمی — لینک در نوار آدرس در دسترس است
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((l) => (
        <a
          key={l.id}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          title={l.label}
          className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-accent-500 hover:text-primary-950"
        >
          <l.icon />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="کپی لینک مقاله"
        title="کپی لینک"
        className={`grid h-10 w-10 place-items-center rounded-lg transition ${
          copied
            ? "bg-green-100 text-green-600"
            : "bg-slate-100 text-slate-500 hover:bg-accent-500 hover:text-primary-950"
        }`}
      >
        {copied ? <FaCheck /> : <FaLink />}
      </button>
    </div>
  );
}
