import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { processSteps } from "@/data/site";

export default function ProcessSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="روند همکاری"
          title="از درخواست تا تحویل، در ۴ گام"
          subtitle="فرایند شفاف ما باعث می‌شود در هر لحظه بدانید محموله‌تان در چه مرحله‌ای است."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.12}>
              <div className="relative h-full rounded-2xl bg-white p-8 shadow-card">
                <span className="absolute -top-5 end-6 grid h-12 w-12 place-items-center rounded-xl bg-accent-500 text-lg font-black text-primary-950 shadow">
                  {step.step}
                </span>
                <h3 className="mb-3 mt-4 text-lg font-black text-primary-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-7 text-slate-500">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
