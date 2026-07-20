// ─────────────────────────────────────────────────────────────
// GET /uploads/* — سرو فایل‌های آپلودشده در زمان اجرا
//
// چرا این روت لازم است؟ `next start` فقط فایل‌هایی از public/ را سرو
// می‌کند که «هنگام build» وجود داشته‌اند؛ تصاویری که بعداً با API آپلود
// می‌شوند 404 می‌گیرند. این روت آن‌ها را مستقیم از دیسک می‌خواند.
//
// در production، nginx مسیر /uploads/ را مستقیم از دیسک سرو می‌کند و
// درخواست اصلاً به Next نمی‌رسد؛ این روت پوشش محیط dev و درخواست‌های
// داخلی بهینه‌ساز تصویر (next/image) است.
// ─────────────────────────────────────────────────────────────
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ROOT = path.join(process.cwd(), "public", "uploads");

// فقط انواع مجاز آپلود سرو می‌شوند
const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// هر بخش مسیر فقط کاراکترهای امن؛ جلوی path traversal را می‌گیرد
const SEGMENT_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

export async function GET(_req, { params }) {
  const { path: segments } = await params;

  if (
    !Array.isArray(segments) ||
    segments.length === 0 ||
    segments.some((s) => !SEGMENT_RE.test(s) || s.includes(".."))
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(ROOT, ...segments);
  // دفاع دوم: مسیر نهایی حتماً داخل پوشهٔ uploads باشد
  if (!filePath.startsWith(ROOT + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const mime = MIME[path.extname(filePath).toLowerCase()];
  if (!mime) return new NextResponse("Not found", { status: 404 });

  let buf;
  try {
    buf = await fs.readFile(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(buf, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(buf.length),
      // نام فایل‌ها یکتا هستند (timestamp + random) پس کش دائمی امن است
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
