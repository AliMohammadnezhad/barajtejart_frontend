import Link from "next/link";
import { FaArrowLeft, FaPhoneAlt } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import { cta, siteConfig } from "@/data/site";

export default function CTABanner() {
  return (
    <section className="bg-slate-50 pb-24">
      <div className="container-site">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary-900 px-8 py-14 text-center sm:px-16">
            {/* دایره‌های تزئینی */}
            <span className="absolute -start-16 -top-16 h-56 w-56 rounded-full bg-accent-500/10" />
            <span className="absolute -bottom-20 -end-16 h-64 w-64 rounded-full bg-accent-500/10" />

            <h2 className="relative mx-auto max-w-2xl text-3xl font-black leading-snug text-white sm:text-4xl">
              {cta.title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl leading-8 text-slate-300">
              {cta.subtitle}
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <Link href={cta.button.href} className="btn-primary">
                {cta.button.label}
                <FaArrowLeft />
              </Link>
              <a href={siteConfig.phoneLink} className="btn-outline">
                <FaPhoneAlt />
                <span dir="ltr">{siteConfig.phone}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
