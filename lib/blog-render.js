// ─────────────────────────────────────────────────────────────
// رندر محتوای مقاله: Markdown یا HTML → HTML نهایی
// + تزریق id به تیترها، ساخت فهرست مطالب و محاسبهٔ زمان مطالعه
// ─────────────────────────────────────────────────────────────
import { marked } from "marked";

/** اعداد لاتین → فارسی */
export function toFaDigits(value) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

/** شناسهٔ لنگر از متن تیتر (با حفظ حروف فارسی) */
function headingId(text, used) {
  let id = text
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "heading";
  let unique = id;
  let n = 2;
  while (used.has(unique)) unique = `${id}-${n++}`;
  used.add(unique);
  return unique;
}

/** زمان مطالعه بر اساس ~۱۸۰ کلمه در دقیقه */
export function computeReadingTime(html) {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${toFaDigits(minutes)} دقیقه`;
}

/**
 * خروجی: { html, toc, readingTime }
 * toc: [{ id, text, level }] از تیترهای h2 و h3
 */
export function renderPost(post) {
  const raw =
    post.contentFormat === "html"
      ? post.content
      : marked.parse(post.content ?? "", { async: false });

  const toc = [];
  const used = new Set();
  const html = raw.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match, level, attrs, inner) => {
      const text = stripTags(inner);
      const id = headingId(text, used);
      toc.push({ id, text, level: Number(level) });
      // اگر id از قبل وجود دارد دست نمی‌زنیم
      if (/\bid=/.test(attrs)) return match;
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );

  return {
    html,
    toc,
    readingTime: post.readingTime || computeReadingTime(raw),
  };
}
