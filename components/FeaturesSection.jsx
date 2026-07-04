import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServiceIcon from "@/components/ServiceIcon";
import { features } from "@/data/site";

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="چرا باراج تجارت؟"
          title="مزیت‌هایی که تفاوت را می‌سازند"
          subtitle="از ظرفیت بالای ناوگان تا بیمهٔ کامل محموله؛ دلایلی که مشتریان ما را ماندگار کرده است."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <div className="flex h-full items-start gap-5 rounded-2xl border border-slate-100 p-7 transition hover:border-accent-400 hover:shadow-card">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-accent-500/10 text-2xl text-accent-600">
                  <ServiceIcon name={f.icon} />
                </span>
                <div>
                  <h3 className="mb-2 font-black text-primary-900">{f.title}</h3>
                  <p className="text-sm leading-7 text-slate-500">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
