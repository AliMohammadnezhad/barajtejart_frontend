// ─────────────────────────────────────────────────────────────
// POST /api/blog/webhook — انتشار یا به‌روزرسانی مقاله
//
// احراز هویت:  هدر  x-webhook-secret: <BLOG_WEBHOOK_SECRET>
//              (یا  Authorization: Bearer <BLOG_WEBHOOK_SECRET>)
// مقدار secret در فایل .env.production روی سرور تنظیم می‌شود.
// ─────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";
import { savePost } from "@/lib/blog";
import { siteUrl } from "@/data/site";

export const runtime = "nodejs";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CONTENT_LENGTH = 200_000; // ~200KB متن

function isAuthorized(req) {
  const secret = process.env.BLOG_WEBHOOK_SECRET;
  if (!secret) return null; // پیکربندی نشده
  const provided =
    req.headers.get("x-webhook-secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b); // مقایسهٔ زمان-ثابت
}

function validate(body) {
  const errors = [];
  const isStr = (v) => typeof v === "string" && v.trim().length > 0;

  if (!isStr(body.slug) || !SLUG_RE.test(body.slug))
    errors.push("slug: required; lowercase letters/digits/hyphens only (e.g. my-new-post)");
  if (!isStr(body.title)) errors.push("title: required non-empty string");
  if (!isStr(body.description)) errors.push("description: required non-empty string");
  if (!isStr(body.content)) errors.push("content: required non-empty string");
  else if (body.content.length > MAX_CONTENT_LENGTH)
    errors.push(`content: exceeds ${MAX_CONTENT_LENGTH} characters`);
  if (body.contentFormat && !["markdown", "html"].includes(body.contentFormat))
    errors.push('contentFormat: must be "markdown" or "html"');
  if (!isStr(body.featuredImage))
    errors.push("featuredImage: required (e.g. /images/post-1-min-2.jpg or full https URL)");
  if (body.publishDate && isNaN(Date.parse(body.publishDate)))
    errors.push("publishDate: must be a valid date (ISO, e.g. 2026-07-18)");
  if (body.tags && !(Array.isArray(body.tags) && body.tags.every((t) => isStr(t))))
    errors.push("tags: must be an array of strings");

  return errors;
}

export async function POST(req) {
  const auth = isAuthorized(req);
  if (auth === null)
    return NextResponse.json(
      { ok: false, error: "Webhook is not configured (BLOG_WEBHOOK_SECRET missing on server)" },
      { status: 503 }
    );
  if (!auth)
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length)
    return NextResponse.json({ ok: false, errors }, { status: 422 });

  // فقط فیلدهای شناخته‌شده ذخیره می‌شوند
  const post = {
    slug: body.slug.trim(),
    title: body.title.trim(),
    description: body.description.trim(),
    metaTitle: body.metaTitle?.trim() || null,
    metaDescription: body.metaDescription?.trim() || null,
    content: body.content,
    contentFormat: body.contentFormat || "markdown",
    featuredImage: body.featuredImage.trim(),
    featuredImageAlt: body.featuredImageAlt?.trim() || body.title.trim(),
    author: body.author?.trim() || "تحریریهٔ باراج تجارت",
    publishDate: body.publishDate || new Date().toISOString().slice(0, 10),
    updatedDate: new Date().toISOString().slice(0, 10),
    tags: body.tags ?? [],
    category: body.category?.trim() || "عمومی",
    readingTime: body.readingTime?.trim() || null,
    draft: body.draft === true,
  };

  await savePost(post);

  // پاک‌سازی کش صفحات تحت‌تأثیر — مقاله بلافاصله روی سایت دیده می‌شود
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/"); // بخش وبلاگ صفحهٔ اصلی
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    ok: true,
    slug: post.slug,
    url: `${siteUrl}/blog/${post.slug}`,
    draft: post.draft,
  });
}
