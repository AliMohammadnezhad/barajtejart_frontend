import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { formatDateFa } from "@/lib/blog";
import { computeReadingTime } from "@/lib/blog-render";

/** کارت مقاله — در فهرست وبلاگ و بخش «مقالات مرتبط» استفاده می‌شود */
export default function PostCard({ post, headingLevel = "h2" }) {
  const Heading = headingLevel;
  const readingTime = post.readingTime || computeReadingTime(post.content ?? "");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block h-52 overflow-hidden"
      >
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt || post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
        {post.category && (
          <span className="absolute right-4 top-4 rounded-full bg-primary-950/85 px-3 py-1 text-xs font-bold text-accent-400">
            {post.category}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-7">
        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <FaRegCalendarAlt className="text-accent-500" />
            <time dateTime={post.publishDate}>{formatDateFa(post.publishDate)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <FaRegClock className="text-accent-500" />
            {readingTime} مطالعه
          </span>
        </div>

        <Heading className="mb-3 text-lg font-black leading-8 text-primary-900">
          <Link
            href={`/blog/${post.slug}`}
            className="transition group-hover:text-accent-600"
          >
            {post.title}
          </Link>
        </Heading>

        <p className="mb-5 flex-1 text-sm leading-8 text-slate-500">
          {post.description}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-accent-600"
        >
          ادامه مطلب
          <FaArrowLeft className="transition group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
