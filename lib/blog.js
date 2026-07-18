// ─────────────────────────────────────────────────────────────
// لایهٔ دسترسی به دادهٔ وبلاگ (Repository)
//
// دو منبع داده با هم ادغام می‌شوند:
//   content/posts/      → مقالات پایه (داخل ریپو، با هر دیپلوی به‌روز)
//   content/published/  → مقالات وب‌هوک (خارج از گیت؛ بین دیپلوی‌ها باقی می‌ماند)
// اگر اسلاگ تکراری باشد، نسخهٔ published برنده است (به‌روزرسانی مقاله).
// ─────────────────────────────────────────────────────────────
import fs from "fs/promises";
import path from "path";

const SEED_DIR = path.join(process.cwd(), "content", "posts");
const PUBLISHED_DIR = path.join(process.cwd(), "content", "published");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function readPostsFrom(dir) {
  let files;
  try {
    files = await fs.readdir(dir);
  } catch {
    return []; // پوشه هنوز ساخته نشده
  }
  const posts = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const post = JSON.parse(raw);
      if (post?.slug && SLUG_RE.test(post.slug)) posts.push(post);
    } catch {
      // فایل خراب، نادیده گرفته می‌شود تا کل وبلاگ از کار نیفتد
    }
  }
  return posts;
}

/** همهٔ مقالات منتشرشده، مرتب از جدید به قدیم */
export async function getAllPosts() {
  const [seed, published] = await Promise.all([
    readPostsFrom(SEED_DIR),
    readPostsFrom(PUBLISHED_DIR),
  ]);
  const bySlug = new Map();
  for (const p of seed) bySlug.set(p.slug, p);
  for (const p of published) bySlug.set(p.slug, p); // نسخهٔ وب‌هوک برنده است
  return [...bySlug.values()]
    .filter((p) => p.draft !== true)
    .sort((a, b) => new Date(b.publishDate ?? 0) - new Date(a.publishDate ?? 0));
}

export async function getPostBySlug(slug) {
  if (!SLUG_RE.test(String(slug ?? ""))) return null;
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** مقالات مرتبط: اول هم‌دسته‌ها، بعد اشتراک برچسب، بعد جدیدترین‌ها */
export async function getRelatedPosts(post, limit = 3) {
  const others = (await getAllPosts()).filter((p) => p.slug !== post.slug);
  const score = (p) => {
    let s = 0;
    if (p.category && p.category === post.category) s += 2;
    const shared = (p.tags ?? []).filter((t) => (post.tags ?? []).includes(t));
    s += shared.length;
    return s;
  };
  return others
    .map((p) => [score(p), p])
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([, p]) => p);
}

/** ذخیرهٔ اتمی مقالهٔ رسیده از وب‌هوک */
export async function savePost(post) {
  if (!SLUG_RE.test(post.slug)) throw new Error("invalid slug");
  await fs.mkdir(PUBLISHED_DIR, { recursive: true });
  const target = path.join(PUBLISHED_DIR, `${post.slug}.json`);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(post, null, 2), "utf8");
  await fs.rename(tmp, target); // rename اتمی است؛ فایل نیمه‌نوشته باقی نمی‌ماند
  return target;
}

/** نمایش تاریخ به شمسی — ورودی ISO مثل "2024-03-10" */
export function formatDateFa(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}
