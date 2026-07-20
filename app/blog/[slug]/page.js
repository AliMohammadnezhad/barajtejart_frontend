import Link from "next/link";
import { notFound } from "next/navigation";
import PostImage from "@/components/blog/PostImage";
import { FaRegCalendarAlt, FaRegClock, FaUser } from "react-icons/fa";
import CTABanner from "@/components/CTABanner";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import PostCard from "@/components/blog/PostCard";
import ShareButtons from "@/components/blog/ShareButtons";
import TableOfContents from "@/components/blog/TableOfContents";
import { formatDateFa, getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { renderPost } from "@/lib/blog-render";
import { articleSchema, breadcrumbSchema } from "@/lib/seo";
import { siteUrl } from "@/data/site";

// اسلاگ‌های زمان build؛ مقالات جدید وب‌هوک به‌صورت on-demand رندر می‌شوند
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.description;

  return {
    title,
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate || post.publishDate,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { html, toc, readingTime } = renderPost(post);
  const related = await getRelatedPosts(post);
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "وبلاگ", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* ── سربرگ مقاله ── */}
      <header className="bg-primary-950 pb-16 pt-36">
        <div className="container-site max-w-4xl text-center">
          {/* مسیر راهنما */}
          <nav
            aria-label="مسیر صفحه"
            className="mb-6 flex flex-wrap justify-center gap-2 text-sm text-slate-400"
          >
            <Link href="/" className="transition hover:text-accent-400">
              صفحه اصلی
            </Link>
            <span>/</span>
            <Link href="/blog" className="transition hover:text-accent-400">
              وبلاگ
            </Link>
            <span>/</span>
            <span className="text-accent-400">{post.title}</span>
          </nav>

          {post.category && (
            <span className="mb-4 inline-block rounded-full bg-accent-500/10 px-4 py-1 text-sm font-bold text-accent-400">
              {post.category}
            </span>
          )}

          <h1 className="text-3xl font-black leading-snug text-white sm:text-4xl">
            {post.title}
          </h1>

          {/* نویسنده، تاریخ، زمان مطالعه */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <FaUser className="text-accent-400" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-accent-400" />
              <time dateTime={post.publishDate}>
                {formatDateFa(post.publishDate)}
              </time>
            </span>
            <span className="flex items-center gap-2">
              <FaRegClock className="text-accent-400" />
              {readingTime} مطالعه
            </span>
          </div>
        </div>
      </header>

      {/* ── بدنهٔ مقاله ── */}
      <div className="container-site py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <Reveal>
              <figure className="relative mb-10 h-64 overflow-hidden rounded-3xl shadow-card sm:h-[26rem]">
                <PostImage
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>

            {/* محتوای اصلی — از Markdown/HTML رندر شده */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* برچسب‌ها */}
            {post.tags?.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2" aria-label="برچسب‌ها">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-500"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            {/* اشتراک‌گذاری */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <p className="font-black text-primary-900">
                این مقاله را به اشتراک بگذارید:
              </p>
              <ShareButtons url={postUrl} title={post.title} />
            </div>
          </article>

          {/* ── سایدبار ── */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <TableOfContents toc={toc} />

            <div className="rounded-2xl bg-primary-900 p-6 text-center">
              <p className="font-black text-white">
                برای واردات یا ترخیص کالا سوال دارید؟
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                کارشناسان باراج تجارت در کمتر از یک ساعت کاری پاسخ می‌دهند.
              </p>
              <Link href="/contact" className="btn-primary mt-5 w-full">
                مشاوره رایگان
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── مقالات مرتبط ── */}
      {related.length > 0 && (
        <section className="bg-slate-50 py-20" aria-labelledby="related-heading">
          <div className="container-site">
            <h2
              id="related-heading"
              className="mb-10 text-center text-2xl font-black text-primary-900 sm:text-3xl"
            >
              مقالات مرتبط
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.1}>
                  <PostCard post={p} headingLevel="h3" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="bg-slate-50 pb-4 pt-10">
        <CTABanner />
      </div>
    </>
  );
}
