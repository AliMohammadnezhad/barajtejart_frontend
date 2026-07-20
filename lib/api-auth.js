// احراز هویت مشترک APIهای مدیریتی (وب‌هوک مقالات، آپلود تصویر)
// هدر:  x-webhook-secret: <BLOG_WEBHOOK_SECRET>
//  یا:  Authorization: Bearer <BLOG_WEBHOOK_SECRET>
import { timingSafeEqual } from "crypto";

/**
 * خروجی:
 *   true  → مجاز
 *   false → secret نادرست یا غایب
 *   null  → BLOG_WEBHOOK_SECRET روی سرور تنظیم نشده (503 بدهید)
 */
export function isAuthorized(req) {
  const secret = process.env.BLOG_WEBHOOK_SECRET;
  if (!secret) return null;
  const provided =
    req.headers.get("x-webhook-secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b); // مقایسهٔ زمان-ثابت
}
