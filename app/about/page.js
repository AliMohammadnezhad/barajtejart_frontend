import Image from "next/image";
import CTABanner from "@/components/CTABanner";
import FeaturesSection from "@/components/FeaturesSection";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { about } from "@/data/site";

export const metadata = {
  title: "درباره ما",
  description: about.subtitle,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={about.title}
        subtitle={about.subtitle}
        crumbs={[{ label: "درباره ما" }]}
      />

      {/* داستان شرکت */}
      <section className="py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-80 overflow-hidden rounded-3xl shadow-card sm:h-[28rem]">
              <Image
                src={about.image}
                alt={about.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-5 leading-9 text-slate-600">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {about.values.map((v) => (
                <div key={v.title} className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="mb-2 font-black text-primary-900">{v.title}</h3>
                  <p className="text-xs leading-6 text-slate-500">{v.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <div className="bg-slate-50 pt-4">
        <CTABanner />
      </div>
    </>
  );
}
