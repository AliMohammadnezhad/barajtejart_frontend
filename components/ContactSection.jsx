import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { siteConfig } from "@/data/site";

const contactItems = [
  {
    icon: FaPhoneAlt,
    title: "تلفن تماس",
    lines: [siteConfig.phone, siteConfig.mobile],
    dir: "ltr",
  },
  {
    icon: FaEnvelope,
    title: "ایمیل",
    lines: [siteConfig.email, siteConfig.salesEmail],
    dir: "ltr",
  },
  {
    icon: FaMapMarkerAlt,
    title: "آدرس دفتر مرکزی",
    lines: [siteConfig.address],
  },
  {
    icon: FaClock,
    title: "ساعات کاری",
    lines: [siteConfig.workingHours],
  },
];

export default function ContactSection({ heading = true }) {
  return (
    <section className="py-24" id="contact">
      <div className="container-site">
        {heading && (
          <SectionHeading
            eyebrow="تماس با ما"
            title="گفتگو را شروع کنید"
            subtitle="فرم زیر را پر کنید یا مستقیم تماس بگیرید؛ در کمتر از یک ساعت کاری پاسخ می‌دهیم."
          />
        )}

        <div className="grid gap-10 lg:grid-cols-5">
          {/* اطلاعات تماس */}
          <Reveal className="space-y-5 lg:col-span-2">
            {contactItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-900 text-xl text-accent-400">
                  <item.icon />
                </span>
                <div>
                  <h3 className="mb-1 font-black text-primary-900">{item.title}</h3>
                  {item.lines.map((line) => (
                    <p key={line} dir={item.dir} className="text-sm leading-7 text-slate-500 [text-align:start]">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>

          {/* فرم */}
          <Reveal delay={0.15} className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
