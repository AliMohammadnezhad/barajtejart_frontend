import Image from "next/image";
import QRCode from "qrcode";
import { ChevronLeft, Globe, Mail, Phone } from "lucide-react";
import WingedTruckLogo from "@/components/WingedTruckLogo";
import { buildBusinessCardVcard } from "@/lib/vcard";
import { businessCard } from "@/data/site";

// این صفحه برای اشتراک‌گذاری مستقیم (QR / NFC) است — در نتایج جستجو ایندکس نمی‌شود
export const metadata = {
  title: businessCard.metaTitle,
  description: businessCard.metaDescription,
  robots: { index: false, follow: false },
};

const ACTION_ICONS = { call: Phone, email: Mail, website: Globe };

export default async function BusinessCardPage() {
  // کد QR به‌صورت SVG در زمان بیلد ساخته می‌شود — بدون جاوااسکریپت سمت کاربر
  const qrSvg = await QRCode.toString(buildBusinessCardVcard(), {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    width: 560,
    color: { dark: "#0b1320", light: "#ffffff" },
  });

  const actions = [
    { key: "call", ...businessCard.actions.call },
    { key: "email", ...businessCard.actions.email },
    { key: "website", ...businessCard.actions.website },
  ];

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#0b1320] text-white">
      {/* پس‌زمینه: بندر کانتینری تار و تیره با هالهٔ طلایی */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={businessCard.backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover opacity-60 blur-[3px]"
        />
        <div className="absolute inset-0 bg-[#0b1320]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1320]/60 via-transparent to-[#0b1320]" />
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-md flex-col items-center px-6 pb-12 pt-14 sm:justify-center sm:py-16">
        {/* ── سربرگ: لوگو، نام شرکت و شعار ── */}
        <header className="flex animate-fade-up flex-col items-center text-center">
          <WingedTruckLogo className="h-24 w-24 drop-shadow-[0_0_28px_rgba(245,158,11,0.35)]" />
          <h1 className="mt-5 text-3xl font-black text-white">
            {businessCard.companyFa}
          </h1>
          <p className="mt-2 text-sm font-medium text-amber-300/90">
            {businessCard.tagline}
          </p>
        </header>

        {/* ── کد QR با قاب شیشه‌ای ── */}
        <section className="mt-9 w-full animate-fade-up [animation-delay:120ms]">
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 shadow-2xl shadow-black/50 backdrop-blur-md">
            <div
              aria-hidden="true"
              className="mx-auto w-full max-w-[240px] rounded-xl bg-white p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.12)] [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="mt-5 text-center text-sm font-bold text-slate-100">
              {businessCard.qr.captionFa}
            </p>
            <p dir="ltr" className="mt-1 text-center text-xs text-slate-400">
              {businessCard.qr.captionEn}
            </p>
          </div>
        </section>

        {/* ── اطلاعات تماس ── */}
        <section className="mt-7 animate-fade-up text-center [animation-delay:220ms]">
          <p
            dir="ltr"
            className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-slate-300"
          >
            <span>
              {businessCard.ceo.roleFa}:{" "}
              <b className="font-bold text-amber-300">{businessCard.ceo.nameFa}</b>
            </span>
            <span className="text-amber-500/60">|</span>
            <span>
              {businessCard.ceo.roleEn}:{" "}
              <b className="font-bold text-amber-300">{businessCard.ceo.nameEn}</b>
            </span>
          </p>
          <p className="mt-2 text-sm text-slate-300">
            تلفن:{" "}
            <span dir="ltr" className="font-bold text-white">
              {businessCard.phoneDisplay}
            </span>
          </p>
        </section>

        {/* ── دکمه‌های عملیاتی ── */}
        <div className="mt-8 flex w-full animate-fade-up flex-col gap-3 [animation-delay:320ms]">
          {actions.map((action) => {
            const Icon = ACTION_ICONS[action.key];
            const external = action.key === "website";
            return (
              <a
                key={action.key}
                href={action.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex w-full items-center gap-4 rounded-xl border border-amber-500/50 bg-slate-900/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/80 hover:bg-slate-800/80 hover:shadow-[0_10px_36px_rgba(245,158,11,0.18)] active:translate-y-0 active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400 transition-colors duration-300 group-hover:bg-amber-500/20 group-hover:text-amber-300">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span className="flex flex-1 flex-col items-start">
                  <span
                    dir="ltr"
                    className="flex items-center gap-2 text-sm font-bold text-white"
                  >
                    <span>{action.labelEn}</span>
                    <span className="text-amber-500/70">|</span>
                    <span>{action.labelFa}</span>
                  </span>
                  {action.sub && (
                    <span
                      dir="ltr"
                      className="mt-0.5 text-xs text-slate-400 transition-colors group-hover:text-slate-300"
                    >
                      {action.sub}
                    </span>
                  )}
                </span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-amber-500/50 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-amber-400" />
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
