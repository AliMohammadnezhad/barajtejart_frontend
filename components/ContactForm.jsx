"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { siteConfig } from "@/data/site";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30";

/**
 * فرم تماس — از سرویس رایگان Web3Forms استفاده می‌کند.
 * کلید دسترسی را در data/site.js مقداردهی کنید (web3forms.com).
 */
export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.target);
    formData.append("access_key", siteConfig.web3formsAccessKey);
    formData.append("from_name", siteConfig.name);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="mb-2 block text-sm font-bold text-primary-900">
            نام *
          </label>
          <input id="first_name" name="نام" required className={inputClass} placeholder="مثلاً علی" />
        </div>
        <div>
          <label htmlFor="last_name" className="mb-2 block text-sm font-bold text-primary-900">
            نام خانوادگی *
          </label>
          <input id="last_name" name="نام خانوادگی" required className={inputClass} placeholder="مثلاً محمدی" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold text-primary-900">
            آدرس ایمیل *
          </label>
          <input
            id="email"
            name="ایمیل"
            type="email"
            required
            dir="ltr"
            className={`${inputClass} text-right placeholder:text-left`}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-bold text-primary-900">
            موضوع پیام *
          </label>
          <input id="subject" name="موضوع" required className={inputClass} placeholder="مثلاً استعلام حمل دریایی" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-bold text-primary-900">
          پیام شما *
        </label>
        <textarea
          id="message"
          name="پیام"
          rows={5}
          required
          className={inputClass}
          placeholder="جزئیات محموله، مبدأ و مقصد را بنویسید…"
        />
      </div>

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {status === "sending" ? "در حال ارسال…" : "ارسال پیام"}
        <FaPaperPlane />
      </button>

      {status === "success" && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          پیام شما با موفقیت ارسال شد؛ به‌زودی با شما تماس می‌گیریم.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید یا با شماره {siteConfig.phone} تماس بگیرید.
        </p>
      )}
    </form>
  );
}
