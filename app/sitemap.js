import { services, siteUrl } from "@/data/site";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  ];

  const serviceRoutes = services.map((s) => ({
    path: `/services/${s.slug}`,
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  const posts = await getAllPosts();
  const postRoutes = posts.map((p) => ({
    path: `/blog/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: new Date(p.updatedDate || p.publishDate || now),
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes].map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: r.lastModified ?? now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
