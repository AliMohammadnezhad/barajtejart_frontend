// احراز هویت مشترک APIهای مدیریتی (وب‌هوک مقالات، آپلود تصویر)
// هدر:  x-webhook-secret: <BLOG_WEBHOOK_SECRET>
//  یا:  Authorization: Bearer <BLOG_WEBHOOK_SECRET>
import { timingSafeEqual } from "crypto";

/**
 * اعتبارسنجی یک مقدار secret ارائه‌شده (از هدر یا فیلد فرم).
 *   true  → مجاز
 *   false → نادرست یا غایب
 *   null  → BLOG_WEBHOOK_SECRET روی سرور تنظیم نشده (503 بدهید)
 */
export function checkSecret(provided) {
  const secret = process.env.BLOG_WEBHOOK_SECRET;
  if (!secret) return null;
  if (!provided || typeof provided !== "string") return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b); // مقایسهٔ زمان-ثابت
}

/** استخراج secret از هدرهای درخواست */
export function secretFromHeaders(req) {
  return (
    req.headers.get("x-webhook-secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "")
  );
}

/** میان‌بر قدیمی: اعتبارسنجی فقط از روی هدرها */
export function isAuthorized(req) {
  return checkSecret(secretFromHeaders(req));
}
