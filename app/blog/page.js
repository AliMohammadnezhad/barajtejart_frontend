import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";
import CTABanner from "@/components/CTABanner";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { blogPosts } from "@/data/site";

export const metadata = {
  title: "وبلاگ",
  description: "مقالات آموزشی حمل‌ونقل بین‌المللی، گمرک و بازرگانی خارجی.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="وبلاگ باراج تجارت"
        subtitle="راهنماها و تحلیل‌های کاربردی برای واردات، صادرات و امور گمرکی."
        crumbs={[{ label: "وبلاگ" }]}
      />

      <section className="py-24">
        <div className="container-site grid gap-8 sm:grid-cols-2">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 2) * 0.1}>
              <article
                id={post.slug}
                className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card"
              >
                <div className="relative h-56">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <span className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                    <FaRegCalendarAlt className="text-accent-500" />
                    {post.date}
                  </span>
                  <h2 className="mb-4 text-xl font-black leading-8 text-primary-900">
                    {post.title}
                  </h2>
                  <p className="flex-1 text-sm leading-8 text-slate-500">{post.excerpt}</p>
                  <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-400">
                    متن کامل این مقاله به‌زودی منتشر می‌شود.
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="bg-slate-50 pt-4">
        <CTABanner />
      </div>
    </>
  );
}
