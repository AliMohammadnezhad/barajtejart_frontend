import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PostCard from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/blog";

export default async function BlogSection() {
  const posts = (await getAllPosts()).slice(0, 4);

  return (
    <section className="py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="وبلاگ"
          title="آخرین مقالات بازرگانی و امور گمرکی"
          subtitle="راهنماها و تحلیل‌های کاربردی برای واردات، ترخیص کالا و خرید از چین و اروپا."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 4) * 0.1}>
              <PostCard post={post} headingLevel="h3" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
