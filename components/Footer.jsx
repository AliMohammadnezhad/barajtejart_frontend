import Link from "next/link";
import {
  FaClock,
  FaEnvelope,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTelegramPlane,
  FaTruckMoving,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { blogPosts, navLinks, services, siteConfig } from "@/data/site";

const socialIcons = {
  instagram: FaInstagram,
  telegram: FaTelegramPlane,
  whatsapp: FaWhatsapp,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-slate-300">
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* معرفی */}
        <div>
          <Link href="/" className="mb-5 flex items-center gap-2 text-white">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-500 text-primary-950">
              <FaTruckMoving className="text-xl" />
            </span>
            <span className="text-lg font-black">{siteConfig.name}</span>
          </Link>
          <p className="text-sm leading-7">{siteConfig.description}</p>
          <div className="mt-6 flex gap-3">
            {siteConfig.socials.map((s) => {
              const Icon = socialIcons[s.id];
              return (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 transition hover:bg-accent-500 hover:text-primary-950"
                >
                  {Icon && <Icon />}
                </a>
              );
            })}
          </div>
        </div>

        {/* دسترسی آسان */}
        <div>
          <h3 className="mb-5 text-base font-black text-white">دسترسی آسان</h3>
          <ul className="space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-accent-400">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/blog#${blogPosts[0].slug}`} className="transition hover:text-accent-400">
                آخرین مقالات
              </Link>
            </li>
          </ul>
        </div>

        {/* خدمات */}
        <div>
          <h3 className="mb-5 text-base font-black text-white">خدمات ما</h3>
          <ul className="space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="transition hover:text-accent-400"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* اطلاعات تماس */}
        <div>
          <h3 className="mb-5 text-base font-black text-white">راه‌های ارتباطی</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-accent-400" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="shrink-0 text-accent-400" />
              <a href={siteConfig.phoneLink} dir="ltr" className="hover:text-accent-400">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="shrink-0 text-accent-400" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent-400">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <FaClock className="mt-1 shrink-0 text-accent-400" />
              <span>{siteConfig.workingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-site text-center text-xs text-slate-400">
          تمام حقوق مادی و معنوی این وب‌سایت متعلق به {siteConfig.name} است.
        </p>
      </div>
    </footer>
  );
}
