// ─────────────────────────────────────────────────────────────
// لایهٔ دسترسی به دادهٔ وبلاگ (Repository)
//
// دو منبع داده با هم ادغام می‌شوند:
//   content/posts/      → مقالات پایه (داخل ریپو، با هر دیپلوی به‌روز)
//   content/published/  → مقالات وب‌هوک (خارج از گیت؛ بین دیپلوی‌ها باقی می‌ماند)
// اگر اسلاگ تکراری باشد، نسخهٔ published برنده است (به‌روزرسانی مقاله).
//
// وضعیت هر مقاله:
//   status: "active" | "inactive"  → فقط active در سایت دیده می‌شود
//   deleted: true                  → سنگ‌قبر (tombstone)؛ مقالهٔ پایه را از
//                                    خروجی حذف می‌کند چون فایل ریپو با هر
//                                    دیپلوی برمی‌گردد و حذف فیزیکی آن ممکن نیست
// ─────────────────────────────────────────────────────────────
import fs from "fs/promises";
import path from "path";

const SEED_DIR = path.join(process.cwd(), "content", "posts");
const PUBLISHED_DIR = path.join(process.cwd(), "content", "published");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isActive(post) {
  // سازگاری با فیلد قدیمی draft
  return post.deleted !== true && post.status !== "inactive" && post.draft !== true;
}

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

/** ادغام دو منبع؛ شامل مقالات غیرفعال و سنگ‌قبرها (مصرف داخلی/وب‌هوک) */
async function getMergedPosts() {
  const [seed, published] = await Promise.all([
    readPostsFrom(SEED_DIR),
    readPostsFrom(PUBLISHED_DIR),
  ]);
  const bySlug = new Map();
  for (const p of seed) bySlug.set(p.slug, p);
  for (const p of published) bySlug.set(p.slug, p); // نسخهٔ وب‌هوک برنده است
  return [...bySlug.values()];
}

/** مقالات فعال، مرتب از جدید به قدیم — تنها ورودی فرانت‌اند */
export async function getAllPosts() {
  return (await getMergedPosts())
    .filter(isActive)
    .sort((a, b) => new Date(b.publishDate ?? 0) - new Date(a.publishDate ?? 0));
}

/** فقط مقالهٔ فعال — مقالهٔ غیرفعال/حذف‌شده در سایت 404 می‌شود */
export async function getPostBySlug(slug) {
  if (!SLUG_RE.test(String(slug ?? ""))) return null;
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** مقاله با هر وضعیتی (برای عملیات وب‌هوک: update / setStatus / delete) */
export async function getAnyPostBySlug(slug) {
  if (!SLUG_RE.test(String(slug ?? ""))) return null;
  const posts = await getMergedPosts();
  const post = posts.find((p) => p.slug === slug) ?? null;
  return post && post.deleted !== true ? post : null;
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

async function writePublished(slug, data) {
  await fs.mkdir(PUBLISHED_DIR, { recursive: true });
  const target = path.join(PUBLISHED_DIR, `${slug}.json`);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target); // rename اتمی است؛ فایل نیمه‌نوشته باقی نمی‌ماند
  return target;
}

/** ایجاد یا جایگزینی کامل مقاله (upsert) */
export async function savePost(post) {
  if (!SLUG_RE.test(post.slug)) throw new Error("invalid slug");
  return writePublished(post.slug, post);
}

/** تغییر وضعیت فعال/غیرفعال — نسخهٔ کامل مقاله با وضعیت جدید ذخیره می‌شود */
export async function setPostStatus(slug, status) {
  const post = await getAnyPostBySlug(slug);
  if (!post) return null;
  const updated = {
    ...post,
    status,
    draft: undefined,
    updatedDate: new Date().toISOString().slice(0, 10),
  };
  delete updated.draft;
  await writePublished(slug, updated);
  return updated;
}

/**
 * حذف مقاله:
 *  - اگر مقاله «پایه» باشد (داخل ریپو) → سنگ‌قبر نوشته می‌شود
 *  - اگر فقط با وب‌هوک منتشر شده باشد → فایل واقعاً حذف می‌شود
 * خروجی: "tombstoned" | "removed" | null (وجود نداشت)
 */
export async function deletePost(slug) {
  if (!SLUG_RE.test(String(slug ?? ""))) return null;
  const existing = await getAnyPostBySlug(slug);
  if (!existing) return null;

  const seedPosts = await readPostsFrom(SEED_DIR);
  const isSeed = seedPosts.some((p) => p.slug === slug);

  if (isSeed) {
    await writePublished(slug, {
      slug,
      deleted: true,
      deletedAt: new Date().toISOString(),
    });
    return "tombstoned";
  }

  try {
    await fs.unlink(path.join(PUBLISHED_DIR, `${slug}.json`));
  } catch {
    return null;
  }
  return "removed";
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
