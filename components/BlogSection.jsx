import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaRegCalendarAlt } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { blogPosts } from "@/data/site";

export default function BlogSection() {
  return (
    <section className="py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="وبلاگ"
          title="آخرین مقالات حمل‌ونقل و بازرگانی"
          subtitle="راهنماها و تحلیل‌های کاربردی برای واردات، صادرات و امور گمرکی."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 4) * 0.1}>
              <Link
                href={`/blog#${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                    <FaRegCalendarAlt className="text-accent-500" />
                    {post.date}
                  </span>
                  <h3 className="mb-3 font-black leading-7 text-primary-900 transition group-hover:text-accent-600">
                    {post.title}
                  </h3>
                  <p className="mb-5 flex-1 text-sm leading-7 text-slate-500">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-accent-600">
                    ادامه مطلب
                    <FaArrowLeft className="transition group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
