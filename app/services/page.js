import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import CTABanner from "@/components/CTABanner";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import { services } from "@/data/site";

export const metadata = {
  title: "خدمات",
  description:
    "خدمات حمل‌ونقل جاده‌ای، هوایی، دریایی و لجستیک بین‌المللی باراج تجارت.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="خدمات باراج تجارت"
        subtitle="چهار سرویس اصلی ما، تمام مسیرهای حمل داخلی و بین‌المللی کالای شما را پوشش می‌دهد."
        crumbs={[{ label: "خدمات" }]}
      />

      <section className="py-24">
        <div className="container-site space-y-16">
          {services.map((service, i) => (
            <Reveal key={service.slug}>
              <article
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[direction:ltr]" : ""
                }`}
              >
                <div className="relative h-72 overflow-hidden rounded-3xl shadow-card sm:h-96 [direction:rtl]">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="[direction:rtl]">
                  <span className="mb-5 inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary-900 text-2xl text-accent-400">
                    <ServiceIcon name={service.icon} />
                  </span>
                  <h2 className="mb-4 text-2xl font-black text-primary-900 sm:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mb-6 leading-8 text-slate-500">{service.shortDesc}</p>
                  <ul className="mb-8 space-y-3">
                    {service.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                        <FaCheckCircle className="mt-1 shrink-0 text-accent-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${service.slug}`} className="btn-primary">
                    جزئیات این سرویس
                    <FaArrowLeft />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="bg-slate-50 pt-24">
        <CTABanner />
      </div>
    </>
  );
}
