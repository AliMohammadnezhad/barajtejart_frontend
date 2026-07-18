import CTABanner from "@/components/CTABanner";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PostCard from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "وبلاگ",
  description:
    "مقالات آموزشی ترخیص کالا، خرید از چین و اروپا، واردات تجهیزات صنعتی و مفاهیم گمرکی — وبلاگ باراج تجارت.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "وبلاگ باراج تجارت",
    description: "راهنماهای کاربردی واردات، ترخیص کالا و بازرگانی خارجی.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageHeader
        title="وبلاگ باراج تجارت"
        subtitle="راهنماها و تحلیل‌های کاربردی برای واردات، ترخیص کالا و امور گمرکی."
        crumbs={[{ label: "وبلاگ" }]}
      />

      <section className="py-24">
        <div className="container-site grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.1}>
              <PostCard post={post} />
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
