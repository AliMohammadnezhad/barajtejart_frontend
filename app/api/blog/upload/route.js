// ─────────────────────────────────────────────────────────────
// POST /api/blog/upload — آپلود تصویر شاخص مقاله
//
// درخواست: multipart/form-data با فیلد "file"
// احراز هویت: مانند وب‌هوک (هدر x-webhook-secret)
//
// فایل‌ها در public/uploads/blog/ ذخیره می‌شوند؛ این مسیر در گیت
// نیست (gitignore) و مانند content/published بین دیپلوی‌ها می‌ماند.
// خروجی، آدرس فایل برای استفاده در فیلد featuredImage وب‌هوک است.
// ─────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { checkSecret, secretFromHeaders } from "@/lib/api-auth";
import { siteUrl } from "@/data/site";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blog");
const MAX_SIZE = 5 * 1024 * 1024; // ۵ مگابایت

/**
 * تشخیص نوع واقعی فایل از امضای باینری (magic bytes) — نه پسوند و نه
 * Content-Type ادعایی کلاینت؛ جلوی آپلود فایل مخرب با پسوند جعلی را می‌گیرد.
 */
function detectImageType(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "jpg";
  if (
    buf.length > 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  )
    return "png";
  if (
    buf.length > 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  return null;
}

/** نام پایهٔ امن از نام فایل کاربر (فقط a-z0-9-؛ بدون path traversal) */
function safeBaseName(original) {
  const base = path
    .basename(String(original ?? ""), path.extname(String(original ?? "")))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "image";
}

function jsonError(status, error) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req) {
  let form;
  try {
    form = await req.formData();
  } catch {
    return jsonError(400, 'Expected multipart/form-data with a "file" field');
  }

  // secret یا در هدر (x-webhook-secret / Bearer) یا به‌عنوان فیلد فرم "secret"
  const provided = secretFromHeaders(req) || form.get("secret");
  const auth = checkSecret(typeof provided === "string" ? provided : "");
  if (auth === null)
    return jsonError(503, "Upload API is not configured (BLOG_WEBHOOK_SECRET missing on server)");
  if (!auth) return jsonError(401, "Unauthorized");

  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function")
    return jsonError(422, 'Missing "file" field (must be a file, not text)');

  if (file.size > MAX_SIZE)
    return jsonError(413, `File too large: max ${MAX_SIZE / 1024 / 1024}MB`);

  const buf = Buffer.from(await file.arrayBuffer());
  const type = detectImageType(buf);
  if (!type)
    return jsonError(415, "Unsupported file type: only JPEG, PNG and WebP images are accepted");

  // نام یکتا: base-timestamp-random.ext
  const fileName = `${safeBaseName(file.name)}-${Date.now()}-${randomBytes(4).toString("hex")}.${type}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const target = path.join(UPLOAD_DIR, fileName);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, target); // نوشتن اتمی

  const urlPath = `/uploads/blog/${fileName}`;
  return NextResponse.json({
    ok: true,
    fileName,
    path: urlPath, //  ← همین مقدار را در featuredImage وب‌هوک بگذارید
    url: `${siteUrl}${urlPath}`,
    size: file.size,
    type: `image/${type === "jpg" ? "jpeg" : type}`,
  });
}
