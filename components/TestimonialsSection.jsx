import { FaQuoteRight, FaStar } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { testimonials } from "@/data/site";

/** آواتار حروف اول نام — بدون نیاز به تصویر خارجی */
function InitialAvatar({ name }) {
  const initial = name.trim().charAt(0);
  return (
    <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-900 text-lg font-black text-accent-400">
      {initial}
    </span>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="نظرات مشتریان"
          title="اعتماد شما، اعتبار ماست"
          subtitle="بخشی از بازخورد مدیرانی که حمل کالای کسب‌وکارشان را به ما سپرده‌اند."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 4) * 0.1}>
              <figure className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-card">
                <FaQuoteRight className="mb-4 text-2xl text-accent-400" />
                <blockquote className="flex-1 text-sm leading-8 text-slate-600">
                  {t.quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-1 text-accent-500">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <FaStar
                      key={s}
                      className={s < t.rating ? "" : "text-slate-200"}
                    />
                  ))}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <InitialAvatar name={t.name} />
                  <div>
                    <p className="font-black text-primary-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
