import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import CTABanner from "@/components/CTABanner";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo";
import { services } from "@/data/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDesc,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: service.title,
      description: service.shortDesc,
      url: `/services/${slug}`,
      images: [{ url: service.image, width: 1600, height: 900, alt: service.imageAlt }],
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== slug);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: "خدمات", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <PageHeader
        title={service.title}
        subtitle={service.shortDesc}
        crumbs={[{ label: "خدمات", href: "/services" }, { label: service.title }]}
      />

      <section className="py-24">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          {/* محتوای اصلی */}
          <div className="space-y-10 lg:col-span-2">
            <Reveal>
              <div className="relative h-72 overflow-hidden rounded-3xl shadow-card sm:h-[26rem]">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal>
              <h2 className="mb-4 text-2xl font-black text-primary-900">
                دربارهٔ سرویس {service.title}
              </h2>
              <p className="leading-9 text-slate-600">{service.description}</p>
            </Reveal>

            <Reveal>
              <h3 className="mb-5 text-xl font-black text-primary-900">
                امکانات این سرویس
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-accent-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* سایر خدمات */}
          <Reveal delay={0.1}>
            <aside className="space-y-4 lg:sticky lg:top-28">
              <h3 className="text-lg font-black text-primary-900">سایر خدمات</h3>
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:border-accent-400"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-900 text-xl text-accent-400 transition group-hover:bg-accent-500 group-hover:text-primary-950">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <div>
                    <p className="font-black text-primary-900">{s.title}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {s.shortDesc}
                    </p>
                  </div>
                </Link>
              ))}
              <Link href="/contact" className="btn-primary w-full">
                استعلام قیمت این سرویس
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      <div className="bg-slate-50 pt-24">
        <CTABanner />
      </div>
    </>
  );
}
