import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServiceIcon from "@/components/ServiceIcon";
import { services } from "@/data/site";

export default function ServicesSection() {
  return (
    <section className="bg-slate-50 py-24" id="services">
      <div className="container-site">
        <SectionHeading
          eyebrow="خدمات ما"
          title="هر مسیری، یک راهکار حرفه‌ای"
          subtitle="چهار سرویس اصلی باراج تجارت، تمام نیازهای حمل داخلی و بین‌المللی شما را پوشش می‌دهد."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.1}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-white p-8 shadow-card transition duration-300 hover:-translate-y-2"
              >
                <span className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary-900 text-3xl text-accent-400 transition group-hover:bg-accent-500 group-hover:text-primary-950">
                  <ServiceIcon name={service.icon} />
                </span>
                <h3 className="mb-3 text-xl font-black text-primary-900">
                  {service.title}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-7 text-slate-500">
                  {service.shortDesc}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-accent-600">
                  اطلاعات بیشتر
                  <FaArrowLeft className="transition group-hover:-translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
