// ─────────────────────────────────────────────────────────────
// سازنده‌های دادهٔ ساخت‌یافته (Schema.org / JSON-LD)
// همهٔ اسکیماها از لایهٔ داده (data/site.js) تغذیه می‌شوند.
// ─────────────────────────────────────────────────────────────
import { siteConfig, siteUrl, faqs } from "@/data/site";

// شمارهٔ تماس در اسکیما باید بین‌المللی باشد
const PHONE_INTL = siteConfig.phoneLink.replace("tel:", "");

/** سازمان — در تمام صفحات از طریق layout تزریق می‌شود */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: PHONE_INTL,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "بازرگان",
      addressRegion: "آذربایجان غربی",
      addressCountry: "IR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_INTL,
      contactType: "customer service",
      availableLanguage: ["fa"],
    },
    sameAs: siteConfig.socials.map((s) => s.href),
  };
}

/** وب‌سایت */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "fa-IR",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

/** سوالات متداول — صفحاتی که بخش FAQ دارند */
export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** خدمت — صفحهٔ اختصاصی هر سرویس */
export function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDesc,
    url: `${siteUrl}/services/${service.slug}`,
    image: `${siteUrl}${service.image}`,
    serviceType: service.title,
    areaServed: { "@type": "Country", name: "Iran" },
    provider: { "@id": `${siteUrl}/#organization` },
  };
}

/** مقالهٔ وبلاگ — صفحهٔ تک‌مقاله */
export function articleSchema(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}/blog/${post.slug}`,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    headline: post.title,
    description: post.metaDescription || post.description,
    image: `${siteUrl}${post.featuredImage}`,
    datePublished: post.publishDate,
    dateModified: post.updatedDate || post.publishDate,
    inLanguage: "fa-IR",
    keywords: (post.tags ?? []).join(", "),
    articleSection: post.category,
    author: {
      "@type": "Organization",
      name: post.author || siteConfig.name,
      url: siteUrl,
    },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

/** مسیر راهنما (Breadcrumb) — items: [{name, path}] */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: siteUrl },
      ...items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: it.name,
        ...(it.path ? { item: `${siteUrl}${it.path}` } : {}),
      })),
    ],
  };
}
