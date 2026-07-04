import Reveal from "@/components/Reveal";

/** سرتیتر استاندارد بخش‌ها: بالانویس کهربایی + عنوان + توضیح اختیاری */
export default function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-accent-500/10 px-4 py-1 text-sm font-bold text-accent-600">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl font-black leading-snug sm:text-4xl ${
          light ? "text-white" : "text-primary-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 leading-8 ${light ? "text-slate-300" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
