// ─────────────────────────────────────────────────────────────
// POST /api/blog/webhook — مدیریت کامل مقالات (CRUD)
//
// احراز هویت:  هدر  x-webhook-secret: <BLOG_WEBHOOK_SECRET>
//              (یا  Authorization: Bearer <BLOG_WEBHOOK_SECRET>)
//
// بدنهٔ درخواست همیشه JSON است و فیلد action نوع عملیات را تعیین می‌کند:
//   "upsert"    → ایجاد یا جایگزینی کامل مقاله (پیش‌فرض؛ سازگار با نسخهٔ قبل)
//   "update"    → به‌روزرسانی جزئی مقالهٔ موجود (فقط فیلدهای ارسالی)
//   "setStatus" → فعال/غیرفعال کردن:  { action, slug, status }
//   "delete"    → حذف:                { action, slug }
// ─────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";
import {
  deletePost,
  getAnyPostBySlug,
  savePost,
  setPostStatus,
} from "@/lib/blog";
import { siteUrl } from "@/data/site";

export const runtime = "nodejs";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CONTENT_LENGTH = 200_000; // ~200KB متن
const ACTIONS = ["upsert", "update", "setStatus", "delete"];

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

const isStr = (v) => typeof v === "string" && v.trim().length > 0;

/**
 * اعتبارسنجی فیلدهای مقاله.
 * partial=true → فقط فیلدهای ارسال‌شده بررسی می‌شوند (برای update)
 */
function validateFields(body, { partial = false } = {}) {
  const errors = [];
  const need = (key) => !partial || body[key] !== undefined;

  if (need("title") && !isStr(body.title))
    errors.push("title: must be a non-empty string");
  if (need("description") && !isStr(body.description))
    errors.push("description: must be a non-empty string");
  if (need("content")) {
    if (!isStr(body.content)) errors.push("content: must be a non-empty string");
    else if (body.content.length > MAX_CONTENT_LENGTH)
      errors.push(`content: exceeds ${MAX_CONTENT_LENGTH} characters`);
  }
  if (need("featuredImage") && !isStr(body.featuredImage))
    errors.push("featuredImage: must be a non-empty string (e.g. /images/x.jpg)");
  if (body.contentFormat && !["markdown", "html"].includes(body.contentFormat))
    errors.push('contentFormat: must be "markdown" or "html"');
  if (body.publishDate && isNaN(Date.parse(body.publishDate)))
    errors.push("publishDate: must be a valid date (ISO, e.g. 2026-07-18)");
  if (body.tags && !(Array.isArray(body.tags) && body.tags.every(isStr)))
    errors.push("tags: must be an array of strings");
  if (body.status && !["active", "inactive"].includes(body.status))
    errors.push('status: must be "active" or "inactive"');

  return errors;
}

function jsonError(status, payload) {
  return NextResponse.json({ ok: false, ...payload }, { status });
}

function revalidateBlog(slug) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/"); // بخش وبلاگ صفحهٔ اصلی
  revalidatePath("/sitemap.xml");
}

/** ساخت آبجکت کامل مقاله از بدنهٔ upsert */
function buildPost(body) {
  return {
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
    status: body.status || "active",
  };
}

export async function POST(req) {
  const auth = isAuthorized(req);
  if (auth === null)
    return jsonError(503, {
      error: "Webhook is not configured (BLOG_WEBHOOK_SECRET missing on server)",
    });
  if (!auth) return jsonError(401, { error: "Unauthorized" });

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, { error: "Invalid JSON body" });
  }

  const action = body.action ?? "upsert";
  if (!ACTIONS.includes(action))
    return jsonError(422, {
      error: `action: must be one of ${ACTIONS.join(", ")}`,
    });

  // slug برای همهٔ عملیات لازم است
  if (!isStr(body.slug) || !SLUG_RE.test(body.slug))
    return jsonError(422, {
      errors: ["slug: required; lowercase letters/digits/hyphens only (e.g. my-new-post)"],
    });
  const slug = body.slug.trim();

  // ── حذف ──
  if (action === "delete") {
    const result = await deletePost(slug);
    if (!result) return jsonError(404, { error: `Post "${slug}" not found` });
    revalidateBlog(slug);
    return NextResponse.json({ ok: true, action, slug, result });
  }

  // ── فعال / غیرفعال ──
  if (action === "setStatus") {
    if (!["active", "inactive"].includes(body.status))
      return jsonError(422, { errors: ['status: required; "active" or "inactive"'] });
    const updated = await setPostStatus(slug, body.status);
    if (!updated) return jsonError(404, { error: `Post "${slug}" not found` });
    revalidateBlog(slug);
    return NextResponse.json({
      ok: true,
      action,
      slug,
      status: updated.status,
      url: `${siteUrl}/blog/${slug}`,
    });
  }

  // ── به‌روزرسانی جزئی ──
  if (action === "update") {
    const existing = await getAnyPostBySlug(slug);
    if (!existing) return jsonError(404, { error: `Post "${slug}" not found` });

    const errors = validateFields(body, { partial: true });
    if (errors.length) return jsonError(422, { errors });

    const UPDATABLE = [
      "title", "description", "metaTitle", "metaDescription", "content",
      "contentFormat", "featuredImage", "featuredImageAlt", "author",
      "publishDate", "tags", "category", "readingTime", "status",
    ];
    const merged = { ...existing };
    for (const key of UPDATABLE)
      if (body[key] !== undefined)
        merged[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
    merged.updatedDate = new Date().toISOString().slice(0, 10);
    delete merged.draft;

    await savePost(merged);
    revalidateBlog(slug);
    return NextResponse.json({
      ok: true,
      action,
      slug,
      status: merged.status ?? "active",
      url: `${siteUrl}/blog/${slug}`,
    });
  }

  // ── ایجاد / جایگزینی کامل (upsert) ──
  const required = ["title", "description", "content", "featuredImage"]
    .filter((k) => body[k] === undefined)
    .map((k) => `${k}: required`);
  const errors = [...required, ...validateFields(body)];
  if (errors.length) return jsonError(422, { errors });

  const post = buildPost(body);
  const existed = (await getAnyPostBySlug(slug)) !== null;
  await savePost(post);
  revalidateBlog(slug);

  return NextResponse.json({
    ok: true,
    action,
    created: !existed,
    slug: post.slug,
    status: post.status,
    url: `${siteUrl}/blog/${post.slug}`,
  });
}
